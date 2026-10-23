from models.Product import ProductCreate, ProductModel
from models.User import UserModel
from repository.category_repository import CategoryRepository
from repository.product_repository import ProductRepository
from services.pricing import get_pricing_strategy
from use_cases.ResolveCategory import resolve_category


def create_new_product(
    repository: ProductRepository,
    category_repository: CategoryRepository,
    product_data: ProductCreate,
    current_user: UserModel,
):
    """
    Crea un nuevo producto en la base de datos. El dueño es siempre el usuario del token.
    """
    category = resolve_category(category_repository, product_data.category, product_data.name)

    # Se construye campo a campo (no con model_validate) para que nada que venga del JSON
    # pueda colarse en columnas como user_id o status.
    db_product = ProductModel(
        name=product_data.name,
        description=product_data.description,
        price=get_pricing_strategy(category.name).calculate_final_price(product_data.price),
        image_url=product_data.image_url,
        user_id=current_user.id,
        category_id=category.id,
    )

    repository.add_product(db_product)

    return db_product
