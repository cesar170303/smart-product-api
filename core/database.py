from sqlmodel import create_engine, Session
import os
from dotenv import load_dotenv

# cargar el archivo .env
load_dotenv()

# Accede a las variables de entorno
database_url = os.getenv("DATABASE_URL")

engine = create_engine(database_url, echo=True)


def get_session():
    """Gracias a esta funcion los endpoints no sabran que base de datos hay por detrás,
        solo saben que hay una session pero puede ser cualquier base de datos, etc"""
    with Session(engine) as session:
        yield session