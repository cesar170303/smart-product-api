from models.Order import OrderModel
from models.Product import ProductModel
from sqlalchemy import or_
from sqlalchemy.orm import selectinload
from sqlmodel import Session, select

_WITH_PRODUCT = selectinload(OrderModel.product).options(
    selectinload(ProductModel.category),
    selectinload(ProductModel.seller),
)


class OrderRepository:
    def __init__(self, session: Session):
        self.session = session

    def get_orders_for_user(self, user_id: int):
        """Pedidos en los que el usuario participa: como comprador o como vendedor del producto."""
        statement = (
            select(OrderModel)
            .join(ProductModel, OrderModel.product_id == ProductModel.id)
            .where(or_(OrderModel.buyer_id == user_id, ProductModel.user_id == user_id))
            .options(_WITH_PRODUCT)
            .order_by(OrderModel.created_at.desc())
        )
        return self.session.exec(statement).all()

    def get_all_orders(self):
        statement = select(OrderModel).options(_WITH_PRODUCT).order_by(OrderModel.created_at.desc())
        return self.session.exec(statement).all()

    def get_order_by_id(self, order_id: int, for_update: bool = False):
        statement = select(OrderModel).where(OrderModel.id == order_id).options(_WITH_PRODUCT)
        if for_update:
            # Solo bloquea la fila del pedido; el producto se bloquea aparte en el caso de uso
            statement = statement.with_for_update(of=OrderModel)
        return self.session.exec(statement).first()

    def save(self, order: OrderModel, product: ProductModel):
        """Guarda pedido y producto en UNA sola transacción: o cambian los dos o no cambia ninguno."""
        self.session.add(order)
        self.session.add(product)
        self.session.commit()
        self.session.refresh(order)
