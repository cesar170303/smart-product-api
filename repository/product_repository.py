from models.models import ProductModel
from sqlmodel import Session, select

class ProductRepository:
    def __init__(self, session: Session):
        self.session = session

    def get_products(self):
        statement = select(ProductModel)
        return self.session.exec(statement).all()

    def get_product_by_id(self, product_id: int):
        return self.session.get(ProductModel, product_id)

    def add_product(self, product: ProductModel):
        self.session.add(product)
        self.session.commit()
        self.session.refresh(product)

    def update_product(self, product: ProductModel):
        self.session.merge(product)
        self.session.commit()
        self.session.refresh(product)

    def delete_product(self, product: ProductModel):
        self.session.delete(product)
        self.session.commit()