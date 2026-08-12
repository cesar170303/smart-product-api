

from sqlmodel import Session
from models.models import ProductCreate, ProductModel
from services.ai_services import get_ai_category
from core.exceptions import ProductNotFoundException

def update_products(product : ProductCreate, product_id : int, session: Session):

    product_found = session.get(ProductModel, product_id)

    if product_found is None:
        raise ProductNotFoundException(product_id)

    product_found.name = product.name
    product_found.price = product.price
    product_found.category = product.category

    if not product_found.category:
        category_ai = get_ai_category(product_found.name)
        product_found.category = category_ai

    product_found.apply_pricing_rules()

    session.commit()
    session.refresh(product_found)

    return product_found

