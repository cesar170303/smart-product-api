# Importar todos los modelos aquí garantiza que SQLModel.metadata conozca todas las tablas
# y que las relaciones entre ellas (que se refieren por nombre) puedan resolverse.
from models.Category import CategoryModel
from models.Message import MessageModel
from models.Order import OrderModel
from models.Product import ProductModel
from models.UploadedFile import UploadedFileModel
from models.User import UserModel

__all__ = ["CategoryModel", "MessageModel", "OrderModel", "ProductModel", "UploadedFileModel", "UserModel"]
