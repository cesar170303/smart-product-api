from models.Category import CategoryModel
from repository.category_repository import CategoryRepository
from services.ai_services import get_ai_category

MAX_CATEGORY_LENGTH = 50


def resolve_category(repository: CategoryRepository, category_name: str | None, product_name: str) -> CategoryModel:
    """Devuelve la categoría (fila de `categories`) para un producto.
    Si el cliente no indicó ninguna, se la pedimos a Gemini; si no existe todavía, se crea."""
    name = (category_name or "").strip()

    if not name:
        name = get_ai_category(product_name)

    return repository.get_or_create(name[:MAX_CATEGORY_LENGTH])
