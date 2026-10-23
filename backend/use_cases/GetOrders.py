from core.permissions import is_admin
from models.User import UserModel
from repository.order_repository import OrderRepository


def get_orders(repository: OrderRepository, current_user: UserModel):
    """Un admin ve todos los pedidos; el resto, solo aquellos en los que participa."""
    if is_admin(current_user):
        return repository.get_all_orders()

    return repository.get_orders_for_user(current_user.id)
