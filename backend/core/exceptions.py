from fastapi import Request
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from slowapi.errors import RateLimitExceeded

class ProductNotFoundException(Exception):
    def __init__(self, product_id: int):
        self.product_id = product_id
        self.message = f"Product with ID {product_id} not found"
        super().__init__(self.message)


class AppException(Exception):
    """Base de los errores de negocio: cada subclase fija su código HTTP y el mensaje sale en español."""
    status_code = 400

    def __init__(self, message: str):
        self.message = message
        super().__init__(message)


class BadRequestException(AppException):
    status_code = 400


class ForbiddenException(AppException):
    status_code = 403


class NotFoundException(AppException):
    status_code = 404


class ConflictException(AppException):
    status_code = 409


async def app_exception_handler(request: Request, exc: AppException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"mensaje": exc.message}
    )


async def product_not_found_exception_handler(request: Request, exc: ProductNotFoundException):
    return JSONResponse(
        status_code=404,
        content={"mensaje": exc.message}
    )


async def validation_exception_handler(request: Request, exc: RequestValidationError):

    return JSONResponse(
        status_code = 422,
        # jsonable_encoder: errors() puede traer objetos (ej. un ValueError en "ctx") que json no sabe convertir
        content =  {"mensaje": "Ha ocurrido un error por datos inválidos", "detalles: ": jsonable_encoder(exc.errors())}
    )


async def Starlette_exception_handler(request: Request, exc: StarletteHTTPException):
    return JSONResponse(
            status_code = exc.status_code,
            content =  {"mensaje": exc.detail},
            headers = exc.headers
        )


async def rate_limit_exceeded_handler(request: Request, exc: RateLimitExceeded):
    return JSONResponse(
            status_code = 429,
            content =  {"mensaje": "Demasiadas peticiones. Inténtalo de nuevo en un minuto"},
            headers = {"Retry-After": "60"}
        )


async def exception_handler(request: Request, exc: Exception):
    return JSONResponse(
            status_code = 500,
            content =  {"mensaje": f"Ha ocurrido un error en el servidor"}
        )