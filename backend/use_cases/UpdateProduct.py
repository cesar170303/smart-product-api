from core.exceptions import ProductNotFoundException
from core.permissions import ensure_can_manage_product
from models.Product import ProductCreate
from models.User import UserModel
from repository.category_repository import CategoryRepository
from repository.product_repository import ProductRepository
from services.image_storage import delete_image
from services.pricing import get_pricing_strategy
from use_cases.ResolveCategory import resolve_category


def update_products(
    repository: ProductRepository,
    category_repository: CategoryRepository,
    product: ProductCreate,
    product_id: int,
    current_user: UserModel,
):

    product_found = repository.get_product_by_id(product_id)

    if product_found is None:
        raise ProductNotFoundException(product_id)

    ensure_can_manage_product(product_found, current_user)

    category = resolve_category(category_repository, product.category, product.name)

    old_image_url = product_found.image_url

    product_found.name = product.name
    product_found.description = product.description
    product_found.image_url = product.image_url
    product_found.price = get_pricing_strategy(category.name).calculate_final_price(product.price)
    product_found.category_id = category.id

    repository.update_product(product_found)

    # Si se cambió la foto, la anterior ya no sirve (siempre que ningún otro producto la use)
    if old_image_url != product_found.image_url and not repository.is_image_in_use(old_image_url):
        delete_image(old_image_url)

    return product_found
