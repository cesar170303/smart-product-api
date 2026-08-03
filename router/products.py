from fastapi import HTTPException, Depends, APIRouter
from models.models import ProductModel
from sqlmodel import Session, select
from core.database import get_session
from services.ai_services import get_ai_category


router = APIRouter()

@router.get("/products")
def get_all_products(session: Session = Depends(get_session)):

    statment = select(ProductModel)

    results = session.exec(statment).all()

    return results



@router.get("/products/{product_id}")
def get_product_by_id(product_id: int ,session: Session = Depends(get_session)):
    """ Endpoit solamente para buscar un prducto por su ID"""
    
    product_found = session.get(ProductModel, product_id)

    if not product_found:
        raise HTTPException(status_code=404, detail=f"Product not found {product_id} with that ID")


    return product_found



@router.post("/products")
def add_products(new_product: ProductModel, session: Session = Depends(get_session)):
    

    category_ai = get_ai_category(new_product.name)
    new_product.category = category_ai
    new_product.apply_pricing_rules()

    session.add(new_product)
    session.commit()
    session.refresh(new_product)

    return {"mensaje": "Producto añadido correctamente", "Producto" : new_product}



@router.delete("/products/{product_id}")
def delete_products(product_id : int, session: Session = Depends(get_session)):
    
    product_found = session.get(ProductModel, product_id)

    if not product_found :
            raise HTTPException(status_code=404, detail=f"Product not found {product_id} with that ID")
    
    session.delete(product_found)
    session.commit()

    return {"mensaje": f"El producto {product_found.name} ha sido eliminado correctamente"}



@router.put("/products/{product_id}")
def update_product(product : ProductModel, product_id : int, session: Session = Depends(get_session)):

    product_found = session.get(ProductModel, product_id)

    if product_found is None:
        raise HTTPException(status_code=404, detail=f"Product not found {product_id} with that ID")


    product_found.name = product.name
    product_found.price = product.price
    product_found.category = product.category

    if not product_found.category:
        category_ai = get_ai_category(product_found.name)
        product_found.category = category_ai

    product_found.apply_pricing_rules()

    session.commit()
    session.refresh(product_found)

    return {"mensaje": f"El producto {product_found.name} ha sido actualizado correctamente", "Producto": product_found}



