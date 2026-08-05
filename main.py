from fastapi import FastAPI, Request
from sqlmodel import SQLModel
from core.database import engine
from contextlib import asynccontextmanager
from router import products
from fastapi.responses import JSONResponse
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

app.include_router(products.router)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):

    return JSONResponse(
        status_code = 422,
        content =  {"mensaje": "Ha ocurrido un error por datos inválidos", "detalles: ": exc.errors()}
    )

@app.exception_handler(StarletteHTTPException)
async def Starlette_exception_handler(request: Request, exc: StarletteHTTPException):
    return JSONResponse(
            status_code = exc.status_code,
            content =  {"mensaje": exc.detail}
        )

@app.exception_handler(Exception)
async def exception_handler(request: Request, exc: Exception):
    return JSONResponse(
            status_code = 500,
            content =  {"mensaje": f"Ha ocurrido un error en el servidor"}
        )