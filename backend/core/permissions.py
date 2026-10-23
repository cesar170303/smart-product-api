from core.exceptions import ForbiddenException
from models.Order import OrderModel
from models.Product import ProductModel
from models.User import UserModel, UserRole


def is_admin(user: UserModel) -> bool:
    return user.role == UserRole.ADMIN


def can_view_order(order: OrderModel, user: UserModel) -> bool:
    """Ve un pedido su comprador, el vendedor del producto o un admin."""
    return user.id == order.buyer_id or user.id == order.product.user_id or is_admin(user)


def ensure_can_manage_product(product: ProductModel, user: UserModel) -> None:
    """Un producto solo lo edita o borra quien lo creó o un admin. Si no, 403."""
    if product.user_id != user.id and not is_admin(user):
        raise ForbiddenException("No tienes permiso para modificar este producto")
