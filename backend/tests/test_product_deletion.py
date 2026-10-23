"""Borrar un producto: sus conversaciones se borran con él, y los pedidos siguen protegiéndolo."""
import unittest

from tests.helpers import ProductDataTests, add  # isort: skip

from core.exceptions import ConflictException  # noqa: E402
from models.Order import OrderModel  # noqa: E402
from use_cases.DeleteProduct import delete_product  # noqa: E402


class DeleteProductTests(ProductDataTests):
    def test_deleting_a_product_also_deletes_its_conversations(self):
        product = self.new_product(self.seller)
        self.say(product, "¿Sigue disponible?")
        self.say(product, "Sí", sender=self.seller)

        delete_product(self.repository, product.id, self.seller)

        self.assertIsNone(self.repository.get_product_by_id(product.id))
        self.assertEqual(self.messages(), [])

    def test_deleting_a_product_keeps_the_conversations_of_other_products(self):
        gone = self.new_product(self.seller, "Bicicleta")
        kept = self.new_product(self.seller, "Lámpara")
        self.say(gone, "hola")
        self.say(kept, "buenas")

        delete_product(self.repository, gone.id, self.seller)

        self.assertEqual([message.product_id for message in self.messages()], [kept.id])

    def test_a_product_with_orders_still_cannot_be_deleted(self):
        product = self.new_product(self.seller)
        add(self.session, OrderModel(product_id=product.id, buyer_id=self.buyer.id))
        self.say(product, "hola")

        with self.assertRaises(ConflictException):
            delete_product(self.repository, product.id, self.seller)

        self.assertIsNotNone(self.repository.get_product_by_id(product.id))
        self.assertEqual(len(self.messages()), 1)


if __name__ == "__main__":
    unittest.main()
