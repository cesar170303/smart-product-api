"""Utilidades compartidas por las pruebas que necesitan una base de datos.

Usan SQLite en memoria (con las claves foráneas activadas, como PostgreSQL), así que no necesitan tu base de datos.
Las pruebas se ejecutan desde backend/ con:  python -m unittest discover -s tests -t . -v
"""
import os
import unittest

# services/ai_services.py crea el cliente de Gemini al importarse y falla sin clave. Estas pruebas nunca llaman a
# la IA (reciben la categoría ya escrita), así que basta una clave de relleno que no llega a usarse.
os.environ.setdefault("GEMINI_API_KEY", "clave-de-relleno-solo-para-las-pruebas")

from sqlalchemy import event  # noqa: E402
from sqlalchemy.pool import StaticPool  # noqa: E402
from sqlmodel import Session, SQLModel, create_engine, select  # noqa: E402

import models  # noqa: E402,F401  (registra las tablas)
from models.Category import CategoryModel  # noqa: E402
from models.Message import MessageModel  # noqa: E402
from models.Product import ProductModel  # noqa: E402
from models.User import UserModel  # noqa: E402
from repository.product_repository import ProductRepository  # noqa: E402

IMAGE = "/media/0123456789abcdef0123456789abcdef.png"


def make_session() -> Session:
    engine = create_engine("sqlite://", connect_args={"check_same_thread": False}, poolclass=StaticPool)

    @event.listens_for(engine, "connect")
    def enable_foreign_keys(connection, _record):
        # SQLite ignora las claves foráneas salvo que se pida: así se comporta como PostgreSQL
        connection.execute("PRAGMA foreign_keys=ON")

    SQLModel.metadata.create_all(engine)
    return Session(engine)


def add(session: Session, row):
    session.add(row)
    session.commit()
    session.refresh(row)
    return row


class ProductDataTests(unittest.TestCase):
    """Base con tres usuarios, una categoría y un repositorio de productos sobre SQLite."""

    def setUp(self):
        self.session = make_session()
        self.seller = add(self.session, UserModel(name="Laura", email="laura@example.com", hashed_password="x"))
        self.other_seller = add(self.session, UserModel(name="Irene", email="irene@example.com", hashed_password="x"))
        self.buyer = add(self.session, UserModel(name="Marcos", email="marcos@example.com", hashed_password="x"))
        self.category = add(self.session, CategoryModel(name="Tecnología"))
        self.repository = ProductRepository(self.session)

    def new_product(self, owner, name="Bicicleta"):
        return add(
            self.session,
            ProductModel(name=name, description="Como nueva", price=100.0, image_url=IMAGE, user_id=owner.id, category_id=self.category.id),
        )

    def say(self, product, text, sender=None):
        return add(
            self.session,
            MessageModel(product_id=product.id, buyer_id=self.buyer.id, sender_id=(sender or self.buyer).id, body=text),
        )

    def messages(self):
        return self.session.exec(select(MessageModel)).all()
