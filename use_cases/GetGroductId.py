
from fastapi import HTTPException
from sqlmodel import Session

from models.models import ProductModel


def get_product_id(product_id: int ,session: Session):

    product_found = session.get(ProductModel, product_id)
    
    if not product_found:
        raise HTTPException(status_code=404, detail=f"Product not found {product_id} with that ID")

    return product_found