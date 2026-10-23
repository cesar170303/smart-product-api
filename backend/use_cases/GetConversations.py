from models.Message import ConversationProduct, ConversationRead, MessageRead, ParticipantRead
from models.User import UserModel
from repository.message_repository import MessageRepository


def get_conversations(repository: MessageRepository, current_user: UserModel) -> list[ConversationRead]:
    """Bandeja de entrada: una fila por conversación con el último mensaje, de la más reciente a la más antigua.
    Se llega a ella como comprador (hablas con el vendedor del producto) o como vendedor (hablas con el comprador)."""
    conversations = []

    for last in repository.get_last_messages_for_user(current_user.id):
        product = last.product
        # La otra persona: si el producto es mío, el comprador; si no, el vendedor
        other = last.buyer if product.user_id == current_user.id else product.seller

        conversations.append(
            ConversationRead(
                product=ConversationProduct.model_validate(product, from_attributes=True),
                buyer_id=last.buyer_id,
                other=ParticipantRead.model_validate(other, from_attributes=True),
                last_message=MessageRead.model_validate(last, from_attributes=True),
            )
        )

    return conversations
