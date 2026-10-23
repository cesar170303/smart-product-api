from fastapi import APIRouter, Depends, Request, status
from sqlmodel import Session

from core.database import get_session
from core.dependencies import get_current_user
from core.rate_limit import limiter
from models.Message import ConversationRead, MessageCreate, MessageRead
from models.User import UserModel
from repository.message_repository import MessageRepository
from repository.product_repository import ProductRepository
from use_cases.CreateMessage import create_message
from use_cases.GetConversations import get_conversations
from use_cases.GetMessages import get_messages

# Todo el chat exige estar logueado
router = APIRouter(tags=["Messages"], dependencies=[Depends(get_current_user)])

# El chat del frontend consulta las novedades cada pocos segundos, así que el margen es mayor que en /products
messages_limit = limiter.shared_limit("120/minute", scope="messages")


@router.get("/conversations", response_model=list[ConversationRead])
@messages_limit
def get_my_conversations(request: Request, session: Session = Depends(get_session), current_user: UserModel = Depends(get_current_user)):

    repo = MessageRepository(session)
    return get_conversations(repo, current_user)



@router.get("/products/{product_id}/messages", response_model=list[MessageRead])
@messages_limit
def get_product_messages(
    request: Request,
    product_id: int,
    buyer_id: int | None = None,
    after_id: int = 0,
    session: Session = Depends(get_session),
    current_user: UserModel = Depends(get_current_user),
):
    # buyer_id solo lo usa el vendedor; after_id pide únicamente los mensajes posteriores a ese id

    repo = MessageRepository(session)
    product_repo = ProductRepository(session)
    return get_messages(repo, product_repo, product_id, current_user, buyer_id, after_id)



@router.post("/products/{product_id}/messages", response_model=MessageRead, status_code=status.HTTP_201_CREATED)
@messages_limit
def add_product_message(
    request: Request,
    product_id: int,
    new_message: MessageCreate,
    session: Session = Depends(get_session),
    current_user: UserModel = Depends(get_current_user),
):

    repo = MessageRepository(session)
    product_repo = ProductRepository(session)
    return create_message(repo, product_repo, product_id, new_message, current_user)
