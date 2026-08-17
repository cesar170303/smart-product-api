from fastapi import Depends, APIRouter
from models.models import ProductCreate, ProductPublic
from sqlmodel import Session
from core.database import get_session
from use_cases.CreateProduct import create_new_product
from use_cases.GetAllProduct import get_all_product
from use_cases.GetGroductId import get_product_id
from use_cases.DeleteProduct import delete_product
from use_cases.UpdateProduct import update_products
from repository.product_repository import ProductRepository
from fastapi.security import OAuth2PasswordBearer

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

router = APIRouter()

@router.get("/products",response_model=list[ProductPublic])
def get_all_products(session: Session = Depends(get_session)):

    repo = ProductRepository(session)
    results = get_all_product(repo)
    
    return results



@router.get("/products/{product_id}",response_model=ProductPublic)
def get_product_by_id(product_id: int ,session: Session = Depends(get_session)):

    repo = ProductRepository(session)
    product_found = get_product_id(repo, product_id)
    return product_found




@router.post("/products")
def add_products(new_product: ProductCreate, session: Session = Depends(get_session), token: str = Depends(oauth2_scheme)):

    repo = ProductRepository(session)
    db_product = create_new_product(repo, new_product)

    return {"mensaje": "Producto añadido correctamente", "Producto" : db_product.name}



@router.delete("/products/{product_id}")
def delete_products(product_id : int, session: Session = Depends(get_session)):
    
    repo = ProductRepository(session)
    product_found = delete_product(repo, product_id)
    return {"mensaje": f"El producto ({product_found}) ha sido eliminado correctamente"}



@router.put("/products/{product_id}")
def update_product(product : ProductCreate, product_id : int, session: Session = Depends(get_session)):

    repo = ProductRepository(session)
    product_found = update_products(repo, product, product_id)
    return {"mensaje": f"El producto {product_found.name} ha sido actualizado correctamente", "Producto": product_found.model_dump()}





