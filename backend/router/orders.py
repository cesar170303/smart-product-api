from fastapi import APIRouter, Depends, Request, status
from sqlmodel import Session

from core.database import get_session
from core.dependencies import get_current_user
from core.rate_limit import limiter
from models.Order import OrderCreate, OrderRead, OrderStatusUpdate
from models.User import UserModel
from repository.order_repository import OrderRepository
from repository.product_repository import ProductRepository
from use_cases.CreateOrder import create_order
from use_cases.GetOrderId import get_order_id
from use_cases.GetOrders import get_orders
from use_cases.UpdateOrderStatus import update_order_status

# Todos los endpoints de pedidos exigen estar logueado
router = APIRouter(tags=["Orders"], dependencies=[Depends(get_current_user)])

# Mismo sistema que /products: un contador por IP compartido por todos los endpoints de /orders
orders_limit = limiter.shared_limit("20/minute", scope="orders")


@router.get("/orders", response_model=list[OrderRead])
@orders_limit
def get_my_orders(request: Request, session: Session = Depends(get_session), current_user: UserModel = Depends(get_current_user)):

    repo = OrderRepository(session)
    return get_orders(repo, current_user)



@router.get("/orders/{order_id}", response_model=OrderRead)
@orders_limit
def get_order_by_id(request: Request, order_id: int, session: Session = Depends(get_session), current_user: UserModel = Depends(get_current_user)):

    repo = OrderRepository(session)
    return get_order_id(repo, order_id, current_user)



@router.post("/orders", response_model=OrderRead, status_code=status.HTTP_201_CREATED)
@orders_limit
def add_order(request: Request, new_order: OrderCreate, session: Session = Depends(get_session), current_user: UserModel = Depends(get_current_user)):

    repo = OrderRepository(session)
    product_repo = ProductRepository(session)
    return create_order(repo, product_repo, new_order, current_user)



@router.patch("/orders/{order_id}/status", response_model=OrderRead)
@orders_limit
def change_order_status(request: Request, order_id: int, status_update: OrderStatusUpdate, session: Session = Depends(get_session), current_user: UserModel = Depends(get_current_user)):

    repo = OrderRepository(session)
    product_repo = ProductRepository(session)
    return update_order_status(repo, product_repo, order_id, status_update.status, current_user)
