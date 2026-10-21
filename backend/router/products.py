from fastapi import Depends, APIRouter, Request
from models.Product import ProductCreate, ProductPublic
from sqlmodel import Session
from core.database import get_session
from use_cases.CreateProduct import create_new_product
from use_cases.GetAllProduct import get_all_product
from use_cases.GetGroductId import get_product_id
from use_cases.DeleteProduct import delete_product
from use_cases.UpdateProduct import update_products
from repository.product_repository import ProductRepository
from core.dependencies import get_current_user
from models.User import UserModel
from core.rate_limit import limiter


router = APIRouter(tags=["Products"])

# Un solo contador por IP para todos los endpoints de /products (como app.use('/products', limiter) en Express):
# 5 peticiones por minuto en total, sumando GET, POST, PUT y DELETE
products_limit = limiter.shared_limit("5/minute", scope="products")

@router.get("/products",response_model=list[ProductPublic])
@products_limit
def get_all_products(request: Request, session: Session = Depends(get_session)):

    repo = ProductRepository(session)
    results = get_all_product(repo)
    
    return results



@router.get("/products/{product_id}",response_model=ProductPublic)
@products_limit
def get_product_by_id(request: Request, product_id: int ,session: Session = Depends(get_session)):

    repo = ProductRepository(session)
    product_found = get_product_id(repo, product_id)
    return product_found



@router.post("/products")
@products_limit
def add_products(request: Request, new_product: ProductCreate, session: Session = Depends(get_session), current_user: UserModel = Depends(get_current_user)):

    repo = ProductRepository(session)
    db_product = create_new_product(repo, new_product)

    return {"mensaje": "Producto añadido correctamente", "producto": db_product.name}



@router.delete("/products/{product_id}")
@products_limit
def delete_products(request: Request, product_id : int, session: Session = Depends(get_session), current_user: UserModel = Depends(get_current_user)):
    
    repo = ProductRepository(session)
    product_found = delete_product(repo, product_id)
    return {"mensaje": f"El producto ({product_found}) ha sido eliminado correctamente"}



@router.put("/products/{product_id}")
@products_limit
def update_product(request: Request, product : ProductCreate, product_id : int, session: Session = Depends(get_session), current_user: UserModel = Depends(get_current_user)):

    repo = ProductRepository(session)
    product_found = update_products(repo, product, product_id)
    return {"mensaje": f"El producto {product_found.name} ha sido actualizado correctamente", "producto": product_found.model_dump()}

