
from sqlmodel import Session,select

from models.models import ProductModel


def get_all_product(session: Session):

    statment = select(ProductModel)

    results = session.exec(statment).all()

    return results