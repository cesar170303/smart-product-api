from sqlmodel import Session
from fastapi import HTTPException

from models.models import ProductModel


def delete_product(product_id : int, session: Session ):
    
    product_found = session.get(ProductModel, product_id)

    if not product_found :
            raise HTTPException(status_code=404, detail=f"Product not found {product_id} with that ID")
    
    session.delete(product_found)
    session.commit()

    return product_found.name