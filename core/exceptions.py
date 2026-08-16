from fastapi import Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException

class ProductNotFoundException(Exception):
    def __init__(self, product_id: int):
        self.product_id = product_id
        self.message = f"Product with ID {product_id} not found"
        super().__init__(self.message)


async def product_not_found_exception_handler(request: Request, exc: ProductNotFoundException):
    return JSONResponse(
        status_code=404,
        content={"mensaje": exc.message}
    )


async def validation_exception_handler(request: Request, exc: RequestValidationError):

    return JSONResponse(
        status_code = 422,
        content =  {"mensaje": "Ha ocurrido un error por datos inválidos", "detalles: ": exc.errors()}
    )


async def Starlette_exception_handler(request: Request, exc: StarletteHTTPException):
    return JSONResponse(
            status_code = exc.status_code,
            content =  {"mensaje": exc.detail}
        )


async def exception_handler(request: Request, exc: Exception):
    return JSONResponse(
            status_code = 500,
            content =  {"mensaje": f"Ha ocurrido un error en el servidor"}
        )