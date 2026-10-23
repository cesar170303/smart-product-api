"""Pruebas del chat. No necesitan base de datos ni servidor: los repositorios son falsos.

Se ejecutan desde backend/ con:  python -m unittest discover -s tests -t . -v
"""
import unittest
from datetime import datetime, timezone
from types import SimpleNamespace

from pydantic import ValidationError

from core.exceptions import BadRequestException, NotFoundException, ProductNotFoundException
from models.Message import MAX_MESSAGE_LENGTH, MessageCreate, MessageModel
from use_cases.CreateMessage import create_message
from use_cases.GetConversations import get_conversations
from use_cases.GetMessages import get_messages

SELLER = SimpleNamespace(id=1, name="Laura")
BUYER = SimpleNamespace(id=2, name="Marcos")
OTHER_BUYER = SimpleNamespace(id=3, name="Irene")
PRODUCT = SimpleNamespace(id=10, user_id=SELLER.id, name="Bicicleta", price=120.0, image_url="/media/a.jpg", status="available", seller=SELLER)


class FakeProductRepository:
    def get_product_by_id(self, product_id):
        return PRODUCT if product_id == PRODUCT.id else None


class FakeMessageRepository:
    def __init__(self, orders=()):
        self.messages = []
        self.orders = set(orders)  # (product_id, buyer_id) con pedido

    def conversation_exists(self, product_id, buyer_id):
        return any(m.product_id == product_id and m.buyer_id == buyer_id for m in self.messages)

    def buyer_has_order(self, product_id, buyer_id):
        return (product_id, buyer_id) in self.orders

    def add_message(self, message):
        message.id = len(self.messages) + 1
        message.created_at = datetime(2026, 10, 23, 12, 0, tzinfo=timezone.utc)
        self.messages.append(message)

    def get_message_by_id(self, message_id):
        message = next(m for m in self.messages if m.id == message_id)
        message.sender = SELLER if message.sender_id == SELLER.id else BUYER
        return message

    def get_messages(self, product_id, buyer_id, after_id=0):
        return [m for m in self.messages if m.product_id == product_id and m.buyer_id == buyer_id and m.id > after_id]

    def get_last_messages_for_user(self, user_id):
        last = {}
        for message in self.messages:
            last[(message.product_id, message.buyer_id)] = message
        mine = [m for m in last.values() if m.buyer_id == user_id or PRODUCT.user_id == user_id]
        rows = []
        for message in mine:
            # Objetos simples (no filas del ORM): asignar relaciones de mentira a un MessageModel real falla
            buyer = BUYER if message.buyer_id == BUYER.id else OTHER_BUYER
            rows.append(
                SimpleNamespace(
                    id=message.id,
                    product_id=message.product_id,
                    buyer_id=message.buyer_id,
                    sender_id=message.sender_id,
                    body=message.body,
                    created_at=message.created_at,
                    product=PRODUCT,
                    buyer=buyer,
                    sender=SELLER if message.sender_id == SELLER.id else buyer,
                )
            )
        return sorted(rows, key=lambda row: row.id, reverse=True)


def say(body, buyer_id=None):
    return MessageCreate(body=body, buyer_id=buyer_id)


class MessageCreateTests(unittest.TestCase):
    def test_strips_surrounding_whitespace(self):
        self.assertEqual(say("  hola  ").body, "hola")

    def test_rejects_a_blank_message(self):
        with self.assertRaises(ValidationError):
            say("     ")

    def test_rejects_an_empty_message(self):
        with self.assertRaises(ValidationError):
            say("")

    def test_rejects_a_message_that_is_too_long(self):
        with self.assertRaises(ValidationError):
            say("x" * (MAX_MESSAGE_LENGTH + 1))


class CreateMessageTests(unittest.TestCase):
    def setUp(self):
        self.messages = FakeMessageRepository(orders={(PRODUCT.id, BUYER.id)})
        self.products = FakeProductRepository()

    def send(self, user, body="hola", buyer_id=None, product_id=PRODUCT.id):
        return create_message(self.messages, self.products, product_id, say(body, buyer_id), user)

    def test_buyer_writes_as_themselves(self):
        message = self.send(BUYER)

        self.assertEqual((message.sender_id, message.buyer_id, message.product_id), (BUYER.id, BUYER.id, PRODUCT.id))

    def test_buyer_cannot_speak_on_behalf_of_someone_else(self):
        # aunque mande buyer_id de otra persona, la conversación es la suya
        message = self.send(BUYER, buyer_id=OTHER_BUYER.id)

        self.assertEqual(message.buyer_id, BUYER.id)

    def test_seller_replies_to_a_buyer_with_an_order(self):
        message = self.send(SELLER, buyer_id=BUYER.id)

        self.assertEqual((message.sender_id, message.buyer_id), (SELLER.id, BUYER.id))

    def test_seller_replies_to_a_buyer_who_already_wrote(self):
        self.send(OTHER_BUYER)

        message = self.send(SELLER, buyer_id=OTHER_BUYER.id)

        self.assertEqual(message.buyer_id, OTHER_BUYER.id)

    def test_seller_cannot_write_to_a_stranger(self):
        with self.assertRaises(NotFoundException):
            self.send(SELLER, buyer_id=OTHER_BUYER.id)

    def test_seller_must_indicate_the_buyer(self):
        with self.assertRaises(BadRequestException):
            self.send(SELLER)

    def test_seller_cannot_write_to_themselves(self):
        with self.assertRaises(BadRequestException):
            self.send(SELLER, buyer_id=SELLER.id)

    def test_missing_product(self):
        with self.assertRaises(ProductNotFoundException):
            self.send(BUYER, product_id=999)

    def test_saved_message_is_a_table_row(self):
        self.assertIsInstance(self.send(BUYER), MessageModel)


class GetMessagesTests(unittest.TestCase):
    def setUp(self):
        self.messages = FakeMessageRepository(orders={(PRODUCT.id, BUYER.id)})
        self.products = FakeProductRepository()
        create_message(self.messages, self.products, PRODUCT.id, say("uno"), BUYER)
        create_message(self.messages, self.products, PRODUCT.id, say("dos", BUYER.id), SELLER)
        create_message(self.messages, self.products, PRODUCT.id, say("de otra"), OTHER_BUYER)

    def read(self, user, buyer_id=None, after_id=0):
        return get_messages(self.messages, self.products, PRODUCT.id, user, buyer_id, after_id)

    def test_buyer_sees_only_their_conversation(self):
        self.assertEqual([m.body for m in self.read(BUYER)], ["uno", "dos"])

    def test_seller_sees_the_conversation_of_the_indicated_buyer(self):
        self.assertEqual([m.body for m in self.read(SELLER, buyer_id=OTHER_BUYER.id)], ["de otra"])

    def test_only_newer_messages_with_after_id(self):
        self.assertEqual([m.body for m in self.read(BUYER, after_id=1)], ["dos"])

    def test_seller_cannot_read_a_strangers_conversation(self):
        with self.assertRaises(NotFoundException):
            self.read(SELLER, buyer_id=99)


class GetConversationsTests(unittest.TestCase):
    def setUp(self):
        self.messages = FakeMessageRepository()
        products = FakeProductRepository()
        create_message(self.messages, products, PRODUCT.id, say("hola"), BUYER)
        create_message(self.messages, products, PRODUCT.id, say("buenas"), OTHER_BUYER)
        create_message(self.messages, products, PRODUCT.id, say("dime", BUYER.id), SELLER)

    def test_seller_sees_one_row_per_buyer_with_the_last_message(self):
        rows = get_conversations(self.messages, SELLER)

        self.assertEqual([(row.buyer_id, row.last_message.body, row.other.name) for row in rows], [(BUYER.id, "dime", "Marcos"), (OTHER_BUYER.id, "buenas", "Irene")])

    def test_buyer_sees_only_theirs_and_the_other_person_is_the_seller(self):
        rows = get_conversations(self.messages, BUYER)

        self.assertEqual(len(rows), 1)
        self.assertEqual((rows[0].other.name, rows[0].product.name, rows[0].last_message.sender.name), ("Laura", "Bicicleta", "Laura"))


class MappingTests(unittest.TestCase):
    def test_sqlalchemy_relationships_configure(self):
        # Detecta, sin base de datos, errores como claves foráneas ambiguas hacia users
        from sqlalchemy.orm import configure_mappers

        import models  # noqa: F401

        configure_mappers()


if __name__ == "__main__":
    unittest.main()
