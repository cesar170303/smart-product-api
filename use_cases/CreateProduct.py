from models.models import ProductCreate, ProductModel
from repository.product_repository import ProductRepository
from services.ai_services import get_ai_category


def create_new_product(repository: ProductRepository, product_data: ProductCreate):
    """
    Crea un nuevo producto en la base de datos.
    """
    db_product = ProductModel.model_validate(product_data)

    if not db_product.category:
            category_ai = get_ai_category(db_product.name)
            db_product.category = category_ai
    
    db_product.apply_pricing_rules()
    repository.add_product(db_product)
    
    return db_product