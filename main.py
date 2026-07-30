from fastapi import FastAPI, APIRouter
from sqlmodel import SQLModel
from core.database import engine
from contextlib import asynccontextmanager
from routers import products



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

app.include_router(products.routers)

