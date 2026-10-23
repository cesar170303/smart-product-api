from core.exceptions import BadRequestException, NotFoundException, ProductNotFoundException
from models.Product import ProductModel
from models.User import UserModel
from repository.message_repository import MessageRepository
from repository.product_repository import ProductRepository

CONVERSATION_NOT_FOUND_MESSAGE = "Conversación no encontrada"


def resolve_conversation(
    message_repository: MessageRepository,
    product_repository: ProductRepository,
    product_id: int,
    current_user: UserModel,
    requested_buyer_id: int | None,
) -> tuple[ProductModel, int]:
    """Decide de qué conversación se habla: devuelve el producto y el comprador.

    - Un comprador solo habla como él mismo: el comprador de la conversación es siempre el del token.
    - El vendedor (dueño del producto) tiene que indicar con qué comprador habla, y solo puede escribirle
      si ya hablaron o si ese comprador tiene un pedido de este producto. Así nadie escribe a desconocidos."""
    product = product_repository.get_product_by_id(product_id)
    if product is None:
        raise ProductNotFoundException(product_id)

    if current_user.id != product.user_id:
        return product, current_user.id

    if requested_buyer_id is None or requested_buyer_id == current_user.id:
        raise BadRequestException("Indica con qué comprador quieres hablar")

    reachable = message_repository.conversation_exists(product.id, requested_buyer_id) or message_repository.buyer_has_order(
        product.id, requested_buyer_id
    )
    if not reachable:
        # Mismo 404 que si no existiera: no se revela qué compradores hay
        raise NotFoundException(CONVERSATION_NOT_FOUND_MESSAGE)

    return product, requested_buyer_id
