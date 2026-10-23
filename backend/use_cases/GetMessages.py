from models.User import UserModel
from repository.message_repository import MessageRepository
from repository.product_repository import ProductRepository
from use_cases.ResolveConversation import resolve_conversation


def get_messages(
    repository: MessageRepository,
    product_repository: ProductRepository,
    product_id: int,
    current_user: UserModel,
    buyer_id: int | None = None,
    after_id: int = 0,
):
    """Mensajes de una conversación. Un comprador ve la suya; el vendedor, la del comprador que indica."""
    product, conversation_buyer_id = resolve_conversation(repository, product_repository, product_id, current_user, buyer_id)

    return repository.get_messages(product.id, conversation_buyer_id, after_id)
