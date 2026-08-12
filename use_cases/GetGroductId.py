from sqlmodel import Session

from core.exceptions import ProductNotFoundException
from models.models import ProductModel


def get_product_id(product_id: int ,session: Session):

    product_found = session.get(ProductModel, product_id)
    
    if not product_found:
        raise ProductNotFoundException(product_id)

    return product_found