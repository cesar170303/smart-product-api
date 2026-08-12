from sqlmodel import Session
from fastapi import HTTPException

from core.exceptions import ProductNotFoundException
from models.models import ProductModel


def delete_product(product_id : int, session: Session ):
    
    product_found = session.get(ProductModel, product_id)

    if not product_found:
        raise ProductNotFoundException(product_id)

    session.delete(product_found)
    session.commit()

    return product_found.name