from slowapi import Limiter
from slowapi.util import get_remote_address

# Un único Limiter para toda la app. Cuenta las peticiones por IP del cliente.
# Los contadores viven en memoria: se reinician al reiniciar uvicorn y no se comparten entre workers.
limiter = Limiter(key_func=get_remote_address)
