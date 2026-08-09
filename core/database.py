from sqlmodel import create_engine, Session
import os
from dotenv import load_dotenv


load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError("ERROR CRÍTICO: La variable de entorno DATABASE_URL no está configurada en el archivo .env")

engine = create_engine(DATABASE_URL, echo=True)


def get_session():
    """Gracias a esta funcion los endpoints no sabran que base de datos hay por detrás,
        solo saben que hay una session pero puede ser cualquier base de datos, etc"""
    with Session(engine) as session:
        yield session