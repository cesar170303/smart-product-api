from core.exceptions import ConflictException, ProductNotFoundException
from core.permissions import ensure_can_manage_product
from models.User import UserModel
from repository.product_repository import ProductRepository
from services.image_storage import delete_image


def delete_product(repository: ProductRepository, product_id: int, current_user: UserModel):

    product_found = repository.get_product_by_id(product_id)

    if not product_found:
        raise ProductNotFoundException(product_id)

    ensure_can_manage_product(product_found, current_user)

    # Los pedidos guardan el historial de compras: no se puede borrar un producto que ya tiene alguno
    if repository.has_orders(product_id):
        raise ConflictException("No se puede eliminar un producto que tiene pedidos asociados")

    product_name = product_found.name
    image_url = product_found.image_url
    repository.delete_product(product_found)

    # La foto se borra del disco solo si ningún otro producto la usa (si no, se la quitaríamos a otro vendedor)
    if not repository.is_image_in_use(image_url):
        delete_image(image_url)

    return product_name
