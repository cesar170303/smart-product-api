from fastapi import FastAPI
from sqlmodel import SQLModel
from core.database import engine
from contextlib import asynccontextmanager
from router import products
from core.exceptions import ProductNotFoundException, exception_handler, product_not_found_exception_handler, validation_exception_handler, Starlette_exception_handler

from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException



#async: significa que está diseñado para hacer varias cosas a la vez sin quedarse bloqueado
#Este decorador es una herramienta que coge una función normal y corriente, busca la palabra yield,
#  y automáticamente construye esa clase por ti por debajo. Convierte lo que está antes del yield en el __enter__ y lo que está después en el __exit__.
@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Conectando a la base de datos y creando tablas...")
    SQLModel.metadata.create_all(engine)

    #la función pausa su ejecución y le devuelve el control al Event Loop de FastAPI/Uvicorn.
    yield
    #Esto se acabará ejecutando cuando cerramos el servidor
    print("Cerrando las instalaciones...")


app = FastAPI(lifespan=lifespan)

app.add_exception_handler(RequestValidationError ,validation_exception_handler)
app.add_exception_handler(StarletteHTTPException ,Starlette_exception_handler)
app.add_exception_handler(Exception ,exception_handler)
app.add_exception_handler(ProductNotFoundException ,product_not_found_exception_handler)
app.include_router(products.router)


