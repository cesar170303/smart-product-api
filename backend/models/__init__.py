# Importar todos los modelos aquí garantiza que SQLModel.metadata conozca las 5 tablas
# y que las relaciones entre ellas (que se refieren por nombre) puedan resolverse.
from models.Category import CategoryModel
from models.Message import MessageModel
from models.Order import OrderModel
from models.Product import ProductModel
from models.User import UserModel

__all__ = ["CategoryModel", "MessageModel", "OrderModel", "ProductModel", "UserModel"]
