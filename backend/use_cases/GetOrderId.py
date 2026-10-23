from core.exceptions import NotFoundException
from core.permissions import can_view_order
from models.User import UserModel
from repository.order_repository import OrderRepository


def get_order_id(repository: OrderRepository, order_id: int, current_user: UserModel):

    order = repository.get_order_by_id(order_id)

    # Mismo 404 si no existe o si no participas: no se revela qué pedidos hay
    if order is None or not can_view_order(order, current_user):
        raise NotFoundException("Pedido no encontrado")

    return order
