from datetime import datetime, timezone
from enum import Enum

from sqlalchemy import DateTime, Enum as SAEnum, func
from sqlmodel import Field


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


def created_at_field():
    """Timestamp automático: lo rellena Python al crear el objeto y, por si se inserta por SQL, la propia BD."""
    return Field(
        default_factory=utc_now,
        sa_type=DateTime(timezone=True),
        sa_column_kwargs={"server_default": func.now()},
        nullable=False,
    )


def enum_column_type(enum_class: type[Enum], name: str) -> SAEnum:
    """Enum guardado como texto (con su valor, ej. "available") y un CHECK que impide valores raros.
    Se evita el tipo nativo ENUM de PostgreSQL porque sin Alembic añadir valores después es muy incómodo."""
    return SAEnum(
        enum_class,
        name=name,
        native_enum=False,
        create_constraint=True,
        length=20,
        values_callable=lambda members: [member.value for member in members],
    )
