from models.Message import MessageModel
from models.Order import OrderModel
from models.Product import ProductModel
from sqlalchemy import func, or_
from sqlalchemy.orm import selectinload
from sqlmodel import Session, select

# Máximo de mensajes que devuelve una consulta: una conversación normal cabe de sobra
MESSAGES_LIMIT = 200

# Se cargan remitente, producto y comprador de golpe para no lanzar una consulta extra por mensaje
_WITH_PEOPLE = (
    selectinload(MessageModel.sender),
    selectinload(MessageModel.buyer),
    selectinload(MessageModel.product).selectinload(ProductModel.seller),
)


class MessageRepository:
    def __init__(self, session: Session):
        self.session = session

    def get_messages(self, product_id: int, buyer_id: int, after_id: int = 0):
        """Mensajes de una conversación, del más antiguo al más nuevo.
        Con after_id solo los posteriores a ese (para que el chat pida solo las novedades); sin él, los últimos."""
        statement = (
            select(MessageModel)
            .where(MessageModel.product_id == product_id, MessageModel.buyer_id == buyer_id)
            .options(selectinload(MessageModel.sender))
        )
        if after_id > 0:
            return self.session.exec(statement.where(MessageModel.id > after_id).order_by(MessageModel.id).limit(MESSAGES_LIMIT)).all()

        newest_first = self.session.exec(statement.order_by(MessageModel.id.desc()).limit(MESSAGES_LIMIT)).all()
        return list(reversed(newest_first))

    def get_message_by_id(self, message_id: int):
        statement = select(MessageModel).where(MessageModel.id == message_id).options(selectinload(MessageModel.sender))
        return self.session.exec(statement).first()

    def add_message(self, message: MessageModel):
        self.session.add(message)
        self.session.commit()
        self.session.refresh(message)

    def conversation_exists(self, product_id: int, buyer_id: int) -> bool:
        statement = select(MessageModel.id).where(MessageModel.product_id == product_id, MessageModel.buyer_id == buyer_id)
        return self.session.exec(statement).first() is not None

    def buyer_has_order(self, product_id: int, buyer_id: int) -> bool:
        statement = select(OrderModel.id).where(OrderModel.product_id == product_id, OrderModel.buyer_id == buyer_id)
        return self.session.exec(statement).first() is not None

    def get_last_messages_for_user(self, user_id: int):
        """Último mensaje de cada conversación en la que participa el usuario (como comprador o como vendedor),
        del más reciente al más antiguo."""
        last_ids = (
            select(func.max(MessageModel.id))
            .join(ProductModel, MessageModel.product_id == ProductModel.id)
            .where(or_(MessageModel.buyer_id == user_id, ProductModel.user_id == user_id))
            .group_by(MessageModel.product_id, MessageModel.buyer_id)
        )
        statement = (
            select(MessageModel)
            .where(MessageModel.id.in_(last_ids))
            .options(*_WITH_PEOPLE)
            .order_by(MessageModel.id.desc())
        )
        return self.session.exec(statement).all()
