from fastapi import Depends, APIRouter, Request, status
from models.Product import ProductCreate, ProductRead
from sqlmodel import Session
from core.database import get_session
from use_cases.CreateProduct import create_new_product
from use_cases.GetAllProduct import get_all_product
from use_cases.GetGroductId import get_product_id
from use_cases.DeleteProduct import delete_product
from use_cases.UpdateProduct import update_products
from repository.category_repository import CategoryRepository
from repository.product_repository import ProductRepository
from core.dependencies import get_current_user
from models.User import UserModel
from core.rate_limit import limiter


router = APIRouter(tags=["Products"])

# Un contador por IP para las ESCRITURAS de /products (POST, PUT y DELETE): 30 peticiones por minuto en total.
products_limit = limiter.shared_limit("30/minute", scope="products")

# Las LECTURAS (GET) tienen su propio contador, más amplio: un frontend que lista productos y abre fichas
# hace varias lecturas por minuto y no debe quedarse sin margen para publicar o editar.
products_read_limit = limiter.shared_limit("120/minute", scope="products_read")

@router.get("/products",response_model=list[ProductRead])
@products_read_limit
def get_all_products(request: Request, seller_id: int | None = None, session: Session = Depends(get_session)):
    # seller_id (opcional): solo los productos de ese vendedor

    repo = ProductRepository(session)
    results = get_all_product(repo, seller_id)

    return results



@router.get("/products/{product_id}",response_model=ProductRead)
@products_read_limit
def get_product_by_id(request: Request, product_id: int ,session: Session = Depends(get_session)):

    repo = ProductRepository(session)
    product_found = get_product_id(repo, product_id)
    return product_found



@router.post("/products", response_model=ProductRead, status_code=status.HTTP_201_CREATED)
@products_limit
def add_products(request: Request, new_product: ProductCreate, session: Session = Depends(get_session), current_user: UserModel = Depends(get_current_user)):

    repo = ProductRepository(session)
    category_repo = CategoryRepository(session)
    db_product = create_new_product(repo, category_repo, new_product, current_user)

    return db_product



@router.delete("/products/{product_id}")
@products_limit
def delete_products(request: Request, product_id : int, session: Session = Depends(get_session), current_user: UserModel = Depends(get_current_user)):

    repo = ProductRepository(session)
    product_name = delete_product(repo, product_id, current_user)
    return {"mensaje": f"El producto ({product_name}) ha sido eliminado correctamente"}



@router.put("/products/{product_id}", response_model=ProductRead)
@products_limit
def update_product(request: Request, product : ProductCreate, product_id : int, session: Session = Depends(get_session), current_user: UserModel = Depends(get_current_user)):

    repo = ProductRepository(session)
    category_repo = CategoryRepository(session)
    product_found = update_products(repo, category_repo, product, product_id, current_user)
    return product_found
