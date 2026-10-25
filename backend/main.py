from fastapi import FastAPI
from sqlmodel import SQLModel
from core.database import engine
from contextlib import asynccontextmanager
import models  # noqa: F401  (registra las tablas en SQLModel.metadata antes del create_all)
from router import auth, messages, orders, products, uploads
from core.exceptions import AppException, ProductNotFoundException, app_exception_handler, exception_handler, product_not_found_exception_handler, validation_exception_handler, Starlette_exception_handler, rate_limit_exceeded_handler
from core.rate_limit import limiter
from slowapi.errors import RateLimitExceeded

from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException

from fastapi.middleware.cors import CORSMiddleware

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173"
]


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


app = FastAPI(lifespan=lifespan, title="Smart Product App", description="API para la gestión de productos inteligentes", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.add_exception_handler(RequestValidationError ,validation_exception_handler)
app.add_exception_handler(StarletteHTTPException ,Starlette_exception_handler)
app.add_exception_handler(Exception ,exception_handler)
app.add_exception_handler(ProductNotFoundException ,product_not_found_exception_handler)
app.add_exception_handler(AppException ,app_exception_handler)

# slowapi busca el limiter en app.state; el handler devuelve el 429 en español
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded ,rate_limit_exceeded_handler)

app.include_router(products.router)
app.include_router(uploads.router)
app.include_router(orders.router)
app.include_router(messages.router)
app.include_router(auth.router)

