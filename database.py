from sqlmodel import create_engine, Session

DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/postgres"

engine = create_engine(DATABASE_URL, echo=True)


def get_session():
    """Gracias a esta funcionn los endpoints no sabran que base de dats hay por detrás,
        solo saben que hay una session pero puede ser cualquier base de datos,etc"""
    with Session(engine) as session:
        yield session