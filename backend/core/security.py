from pwdlib import PasswordHash
from pwdlib.hashers.argon2 import Argon2Hasher
import jwt
from datetime import datetime, timedelta, timezone
from dotenv import load_dotenv
import os

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
EXPIRE_MINUTES_RAW = os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30")

# Solo algoritmos HMAC: firmamos y verificamos con la misma SECRET_KEY
ALLOWED_ALGORITHMS = {"HS256", "HS384", "HS512"}

if not SECRET_KEY:
    raise ValueError("ERROR CRÍTICO: La variable de entorno SECRET_KEY no está configurada en el archivo .env")

if ALGORITHM not in ALLOWED_ALGORITHMS:
    raise ValueError(f"ERROR CRÍTICO: La variable de entorno ALGORITHM debe ser uno de {sorted(ALLOWED_ALGORITHMS)}")

# Si falta usamos 30 minutos; si viene, tiene que ser un entero positivo
try:
    ACCESS_TOKEN_EXPIRE_MINUTES = int(EXPIRE_MINUTES_RAW)
except ValueError:
    raise ValueError(f"ERROR CRÍTICO: ACCESS_TOKEN_EXPIRE_MINUTES debe ser un número entero de minutos (valor actual: '{EXPIRE_MINUTES_RAW}')") from None

if ACCESS_TOKEN_EXPIRE_MINUTES <= 0:
    raise ValueError("ERROR CRÍTICO: ACCESS_TOKEN_EXPIRE_MINUTES debe ser mayor que 0")


password_hasher = PasswordHash([Argon2Hasher()],)

def get_password_hash(password: str) -> str:
    return password_hasher.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return password_hasher.verify(plain_password, hashed_password)


# Hash de relleno: en /login se verifica contra él cuando el email no existe, para que la respuesta
# tarde lo mismo y no se pueda averiguar qué emails están registrados midiendo tiempos.
DUMMY_PASSWORD_HASH = get_password_hash("relleno-para-igualar-tiempos")


def create_access_token(data: dict, expires_delta: timedelta | None = None):
    
    to_encode = data.copy()
    
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    to_encode.update({"exp": expire})

    token = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

    return token


def decode_access_token(token: str) -> dict:
    """Verifica firma y caducidad del token y devuelve su payload.
    Lanza jwt.ExpiredSignatureError o jwt.InvalidTokenError si no es válido."""
    return jwt.decode(
        token,
        SECRET_KEY,
        algorithms=[ALGORITHM],
        options={"require": ["exp", "sub"]},
    )