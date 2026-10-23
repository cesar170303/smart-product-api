from core.exceptions import BadRequestException, ConflictException, ProductNotFoundException
from models.Order import OrderCreate, OrderModel
from models.Product import ProductStatus
from models.User import UserModel
from repository.order_repository import OrderRepository
from repository.product_repository import ProductRepository


def create_order(
    repository: OrderRepository,
    product_repository: ProductRepository,
    order_data: OrderCreate,
    current_user: UserModel,
):
    """Crea un pedido y reserva el producto. El comprador es siempre el usuario del token."""
    # Bloqueamos la fila del producto: si dos compradores llegan a la vez, el segundo espera y ya lo verá reservado
    product = product_repository.get_product_by_id(order_data.product_id, for_update=True)

    if product is None:
        raise ProductNotFoundException(order_data.product_id)

    if product.user_id == current_user.id:
        raise BadRequestException("No puedes comprar tu propio producto")

    if product.status != ProductStatus.AVAILABLE:
        raise ConflictException("El producto no está disponible")

    product.status = ProductStatus.RESERVED
    order = OrderModel(product_id=product.id, buyer_id=current_user.id)

    repository.save(order, product)

    return order
