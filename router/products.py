from fastapi import HTTPException, Depends, APIRouter
from core.exceptions import ProductNotFoundException
from models.models import ProductCreate, ProductPublic
from sqlmodel import Session
from core.database import get_session
from use_cases.CreateProduct import create_new_product
from use_cases.GetAllProduct import get_all_product
from use_cases.GetGroductId import get_product_id
from use_cases.DeleteProduct import delete_product
from use_cases.UpdateProduct import update_products

router = APIRouter()

@router.get("/products",response_model=list[ProductPublic])
def get_all_products(session: Session = Depends(get_session)):

    results = get_all_product(session)
    
    return results



@router.get("/products/{product_id}",response_model=ProductPublic)
def get_product_by_id(product_id: int ,session: Session = Depends(get_session)):

            
    product_found = get_product_id(product_id, session)
    return product_found



    



@router.post("/products")
def add_products(new_product: ProductCreate, session: Session = Depends(get_session)):

    db_product = create_new_product(new_product, session)

    return {"mensaje": "Producto añadido correctamente", "Producto" : db_product}



@router.delete("/products/{product_id}")
def delete_products(product_id : int, session: Session = Depends(get_session)):
    
    
    product_found = delete_product(product_id, session)
    return {"mensaje": f"El producto {product_found} ha sido eliminado correctamente"}
    




@router.put("/products/{product_id}")
def update_product(product : ProductCreate, product_id : int, session: Session = Depends(get_session)):

    
    product_found = update_products(product, product_id, session)
    return {"mensaje": f"El producto {product_found.name} ha sido actualizado correctamente", "Producto": product_found}





