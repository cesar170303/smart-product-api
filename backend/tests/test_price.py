"""El precio publicado es el que escribe el vendedor: ninguna categoría lo recalcula."""
import unittest
from types import SimpleNamespace

from tests.helpers import IMAGE  # isort: skip

from models.Product import ProductCreate, ProductModel  # noqa: E402
from use_cases.CreateProduct import create_new_product  # noqa: E402
from use_cases.UpdateProduct import update_products  # noqa: E402

CATEGORIES = ["Tecnología", "Deporte", "Ofertas", "Premium", "General", "Hogar"]


class PriceTests(unittest.TestCase):
    def test_creating_a_product_keeps_the_typed_price_for_every_category(self):
        for category in CATEGORIES:
            with self.subTest(category=category):
                stored = []
                products = SimpleNamespace(add_product=stored.append)
                categories = SimpleNamespace(get_or_create=lambda name: SimpleNamespace(id=1, name=name))
                data = ProductCreate(name="Cámara", description="Analógica", price=100.0, image_url=IMAGE, category=category)

                create_new_product(products, categories, data, SimpleNamespace(id=7))

                self.assertEqual(stored[0].price, 100.0)

    def test_updating_a_product_keeps_the_typed_price(self):
        existing = ProductModel(id=1, name="Cámara", description="x", price=50.0, image_url=IMAGE, user_id=7, category_id=1)
        products = SimpleNamespace(
            get_product_by_id=lambda _id: existing,
            update_product=lambda _product: None,
            is_image_in_use=lambda _url: True,
        )
        categories = SimpleNamespace(get_or_create=lambda name: SimpleNamespace(id=2, name=name))
        data = ProductCreate(name="Cámara", description="x", price=80.0, image_url=IMAGE, category="Tecnología")

        update_products(products, categories, data, 1, SimpleNamespace(id=7, role="user"))

        self.assertEqual(existing.price, 80.0)


if __name__ == "__main__":
    unittest.main()
