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
        for message in mine:
            message.product = PRODUCT
            message.buyer = BUYER if message.buyer_id == BUYER.id else OTHER_BUYER
            message.sender = SELLER if message.sender_id == SELLER.id else message.buyer
        return sorted(mine, key=lambda m: m.id, reverse=True)


def say(body, buyer_id=None):
    return MessageCreate(body=body, buyer_id=buyer_id)


class MessageCreateTests(unittest.TestCase):
    def test_quita_los_espacios_de_los_extremos(self):
        self.assertEqual(say("  hola  ").body, "hola")

    def test_rechaza_un_mensaje_en_blanco(self):
        with self.assertRaises(ValidationError):
            say("     ")

    def test_rechaza_un_mensaje_vacio(self):
        with self.assertRaises(ValidationError):
            say("")

    def test_rechaza_un_mensaje_demasiado_largo(self):
        with self.assertRaises(ValidationError):
            say("x" * (MAX_MESSAGE_LENGTH + 1))


class CreateMessageTests(unittest.TestCase):
    def setUp(self):
        self.messages = FakeMessageRepository(orders={(PRODUCT.id, BUYER.id)})
        self.products = FakeProductRepository()

    def send(self, user, body="hola", buyer_id=None, product_id=PRODUCT.id):
        return create_message(self.messages, self.products, product_id, say(body, buyer_id), user)

    def test_el_comprador_escribe_como_el_mismo(self):
        message = self.send(BUYER)

        self.assertEqual((message.sender_id, message.buyer_id, message.product_id), (BUYER.id, BUYER.id, PRODUCT.id))

    def test_el_comprador_no_puede_hablar_en_nombre_de_otro(self):
        # aunque mande buyer_id de otra persona, la conversación es la suya
        message = self.send(BUYER, buyer_id=OTHER_BUYER.id)

        self.assertEqual(message.buyer_id, BUYER.id)

    def test_el_vendedor_responde_a_un_comprador_con_pedido(self):
        message = self.send(SELLER, buyer_id=BUYER.id)

        self.assertEqual((message.sender_id, message.buyer_id), (SELLER.id, BUYER.id))

    def test_el_vendedor_responde_a_un_comprador_que_ya_le_escribio(self):
        self.send(OTHER_BUYER)

        message = self.send(SELLER, buyer_id=OTHER_BUYER.id)

        self.assertEqual(message.buyer_id, OTHER_BUYER.id)

    def test_el_vendedor_no_puede_escribir_a_un_desconocido(self):
        with self.assertRaises(NotFoundException):
            self.send(SELLER, buyer_id=OTHER_BUYER.id)

    def test_el_vendedor_tiene_que_indicar_el_comprador(self):
        with self.assertRaises(BadRequestException):
            self.send(SELLER)

    def test_el_vendedor_no_puede_escribirse_a_si_mismo(self):
        with self.assertRaises(BadRequestException):
            self.send(SELLER, buyer_id=SELLER.id)

    def test_producto_inexistente(self):
        with self.assertRaises(ProductNotFoundException):
            self.send(BUYER, product_id=999)

    def test_el_mensaje_guardado_es_un_mensaje_de_la_tabla(self):
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

    def test_el_comprador_ve_solo_su_conversacion(self):
        self.assertEqual([m.body for m in self.read(BUYER)], ["uno", "dos"])

    def test_el_vendedor_ve_la_conversacion_del_comprador_que_indica(self):
        self.assertEqual([m.body for m in self.read(SELLER, buyer_id=OTHER_BUYER.id)], ["de otra"])

    def test_solo_las_novedades_con_after_id(self):
        self.assertEqual([m.body for m in self.read(BUYER, after_id=1)], ["dos"])

    def test_el_vendedor_no_lee_la_de_alguien_que_no_conoce(self):
        with self.assertRaises(NotFoundException):
            self.read(SELLER, buyer_id=99)


class GetConversationsTests(unittest.TestCase):
    def setUp(self):
        self.messages = FakeMessageRepository()
        products = FakeProductRepository()
        create_message(self.messages, products, PRODUCT.id, say("hola"), BUYER)
        create_message(self.messages, products, PRODUCT.id, say("buenas"), OTHER_BUYER)
        create_message(self.messages, products, PRODUCT.id, say("dime", BUYER.id), SELLER)

    def test_el_vendedor_ve_una_fila_por_comprador_con_el_ultimo_mensaje(self):
        rows = get_conversations(self.messages, SELLER)

        self.assertEqual([(row.buyer_id, row.last_message.body, row.other.name) for row in rows], [(BUYER.id, "dime", "Marcos"), (OTHER_BUYER.id, "buenas", "Irene")])

    def test_el_comprador_ve_solo_la_suya_y_la_otra_persona_es_el_vendedor(self):
        rows = get_conversations(self.messages, BUYER)

        self.assertEqual(len(rows), 1)
        self.assertEqual((rows[0].other.name, rows[0].product.name, rows[0].last_message.sender.name), ("Laura", "Bicicleta", "Laura"))


class MappingTests(unittest.TestCase):
    def test_las_relaciones_de_sqlalchemy_se_configuran(self):
        # Detecta, sin base de datos, errores como claves foráneas ambiguas hacia users
        from sqlalchemy.orm import configure_mappers

        import models  # noqa: F401

        configure_mappers()


if __name__ == "__main__":
    unittest.main()
