from repository.product_repository import ProductRepository


def get_all_product(repository: ProductRepository, seller_id: int | None = None):

    return repository.get_products(seller_id)
