from models.Order import OrderModel
from models.Product import ProductModel
from sqlalchemy.orm import selectinload
from sqlmodel import Session, select

# Se cargan categoría y vendedor de golpe para que ProductRead no lance una consulta extra por producto
_WITH_RELATIONS = (selectinload(ProductModel.category), selectinload(ProductModel.seller))


class ProductRepository:
    def __init__(self, session: Session):
        self.session = session

    def get_products(self):
        statement = select(ProductModel).options(*_WITH_RELATIONS)
        return self.session.exec(statement).all()

    def get_product_by_id(self, product_id: int, for_update: bool = False):
        """for_update=True bloquea la fila hasta el commit: dos compradores no pueden reservar el mismo producto a la vez."""
        statement = select(ProductModel).where(ProductModel.id == product_id).options(*_WITH_RELATIONS)
        if for_update:
            # populate_existing: relee el estado real de la BD aunque el objeto ya estuviera cargado en la sesión
            statement = statement.with_for_update().execution_options(populate_existing=True)
        return self.session.exec(statement).first()

    def has_orders(self, product_id: int) -> bool:
        statement = select(OrderModel.id).where(OrderModel.product_id == product_id)
        return self.session.exec(statement).first() is not None

    def is_image_in_use(self, image_url: str) -> bool:
        """¿Algún producto sigue usando esta foto? Las rutas son públicas, así que dos productos podrían compartirla."""
        statement = select(ProductModel.id).where(ProductModel.image_url == image_url)
        return self.session.exec(statement).first() is not None

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
