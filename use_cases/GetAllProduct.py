from repository.product_repository import ProductRepository


def get_all_product(repository: ProductRepository):

    return repository.get_products()
    