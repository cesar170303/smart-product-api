"""GET /products?seller_id=: pedir solo los anuncios de un vendedor."""
import unittest

from tests.helpers import ProductDataTests  # isort: skip

from use_cases.GetAllProduct import get_all_product  # noqa: E402


class SellerFilterTests(ProductDataTests):
    def test_filters_products_by_seller(self):
        mine = self.new_product(self.seller, "Mía")
        self.new_product(self.other_seller, "De Irene")

        self.assertEqual([p.id for p in get_all_product(self.repository, self.seller.id)], [mine.id])

    def test_without_a_filter_returns_every_product(self):
        self.new_product(self.seller, "Mía")
        self.new_product(self.other_seller, "De Irene")

        self.assertEqual(len(get_all_product(self.repository)), 2)

    def test_a_seller_without_products_gets_an_empty_list(self):
        self.new_product(self.seller)

        self.assertEqual(get_all_product(self.repository, self.buyer.id), [])


if __name__ == "__main__":
    unittest.main()
