from fastapi import HTTPException, Depends, APIRouter
from models.models import ProductModel,ProductBase, ProductCreate, ProductPublic
from sqlmodel import Session, select
from core.database import get_session
from services.ai_services import get_ai_category

router = APIRouter()

@router.get("/products",response_model=list[ProductPublic])
def get_all_products(session: Session = Depends(get_session)):

    statment = select(ProductModel)

    results = session.exec(statment).all()

    return results



@router.get("/products/{product_id}",response_model=ProductPublic)
def get_product_by_id(product_id: int ,session: Session = Depends(get_session)):
    
    product_found = session.get(ProductModel, product_id)

    if not product_found:
        raise HTTPException(status_code=404, detail=f"Product not found {product_id} with that ID")


    return product_found



@router.post("/products")
def add_products(new_product: ProductCreate, session: Session = Depends(get_session)):

    db_product = ProductModel.model_validate(new_product)
    if not db_product.category:
            category_ai = get_ai_category(db_product.name)
            db_product.category = category_ai

    
    db_product.apply_pricing_rules()

    session.add(db_product)
    session.commit()
    session.refresh(db_product)

    return {"mensaje": "Producto añadido correctamente", "Producto" : db_product}



@router.delete("/products/{product_id}")
def delete_products(product_id : int, session: Session = Depends(get_session)):
    
    product_found = session.get(ProductModel, product_id)

    if not product_found :
            raise HTTPException(status_code=404, detail=f"Product not found {product_id} with that ID")
    
    session.delete(product_found)
    session.commit()

    return {"mensaje": f"El producto {product_found.name} ha sido eliminado correctamente"}



@router.put("/products/{product_id}")
def update_product(product : ProductCreate, product_id : int, session: Session = Depends(get_session)):

    product_found = session.get(ProductModel, product_id)

    if product_found is None:
        raise HTTPException(status_code=404, detail=f"Product not found {product_id} with that ID")

    db_product = ProductModel.model_validate(product_found)
    
    db_product.name = product.name
    db_product.price = product.price
    db_product.category = product.category

    if not db_product.category:
        category_ai = get_ai_category(db_product.name)
        db_product.category = category_ai

    db_product.apply_pricing_rules()

    session.commit()
    session.refresh(db_product)

    return {"mensaje": f"El producto {db_product.name} ha sido actualizado correctamente", "Producto": db_product}


