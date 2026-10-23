from models.Message import MessageCreate, MessageModel
from models.User import UserModel
from repository.message_repository import MessageRepository
from repository.product_repository import ProductRepository
from use_cases.ResolveConversation import resolve_conversation


def create_message(
    repository: MessageRepository,
    product_repository: ProductRepository,
    product_id: int,
    message_data: MessageCreate,
    current_user: UserModel,
):
    """Guarda un mensaje. El remitente es siempre el usuario del token."""
    product, buyer_id = resolve_conversation(repository, product_repository, product_id, current_user, message_data.buyer_id)

    # Se construye campo a campo para que nada del JSON pueda colarse en sender_id o en las fechas
    message = MessageModel(product_id=product.id, buyer_id=buyer_id, sender_id=current_user.id, body=message_data.body)
    repository.add_message(message)

    # Se vuelve a leer para devolverlo con el remitente cargado
    return repository.get_message_by_id(message.id)
