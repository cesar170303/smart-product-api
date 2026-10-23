from core.exceptions import BadRequestException, ConflictException, ForbiddenException, NotFoundException
from core.permissions import can_view_order, is_admin
from models.Order import OrderStatus
from models.Product import ProductStatus
from models.User import UserModel
from repository.order_repository import OrderRepository
from repository.product_repository import ProductRepository

ORDER_NOT_FOUND_MESSAGE = "Pedido no encontrado"


def update_order_status(
    repository: OrderRepository,
    product_repository: ProductRepository,
    order_id: int,
    new_status: OrderStatus,
    current_user: UserModel,
):
    """
    Un pedido pendiente puede pasar a:
    - completed: solo el vendedor (o un admin). El producto queda "sold".
    - cancelled: comprador, vendedor o admin. El producto vuelve a "available".
    Completed y cancelled son estados finales.
    """
    order = repository.get_order_by_id(order_id, for_update=True)

    # Si no participas en el pedido, para ti no existe (así no se revela qué ids hay)
    if order is None or not can_view_order(order, current_user):
        raise NotFoundException(ORDER_NOT_FOUND_MESSAGE)

    if order.status != OrderStatus.PENDING:
        raise ConflictException(f"El pedido ya está {order.status.value} y no se puede modificar")

    if new_status == OrderStatus.PENDING:
        raise BadRequestException("Un pedido no puede volver a pendiente")

    product = product_repository.get_product_by_id(order.product_id, for_update=True)

    if new_status == OrderStatus.COMPLETED:
        if product.user_id != current_user.id and not is_admin(current_user):
            raise ForbiddenException("Solo el vendedor puede marcar el pedido como completado")
        product.status = ProductStatus.SOLD
    else:
        product.status = ProductStatus.AVAILABLE

    order.status = new_status
    repository.save(order, product)

    return order
