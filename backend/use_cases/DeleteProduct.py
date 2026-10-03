from core.exceptions import ProductNotFoundException
from repository.product_repository import ProductRepository


def delete_product(repository: ProductRepository, product_id: int):

    product_found = repository.get_product_by_id(product_id)

    if not product_found:
        raise ProductNotFoundException(product_id)

    repository.delete_product(product_found)

    return product_found.name