from models.Category import CategoryModel
from sqlalchemy import func
from sqlalchemy.exc import IntegrityError
from sqlmodel import Session, select


class CategoryRepository:
    def __init__(self, session: Session):
        self.session = session

    def get_category_by_name(self, name: str):
        # Sin distinguir mayúsculas: "motor" y "Motor" son la misma categoría
        statement = select(CategoryModel).where(func.lower(CategoryModel.name) == name.strip().lower())
        return self.session.exec(statement).first()

    def get_or_create(self, name: str) -> CategoryModel:
        category = self.get_category_by_name(name)
        if category:
            return category

        category = CategoryModel(name=name.strip())
        self.session.add(category)
        try:
            self.session.commit()
        except IntegrityError:
            # Otra petición creó la misma categoría justo a la vez: usamos la suya
            self.session.rollback()
            return self.get_category_by_name(name)
        self.session.refresh(category)
        return category
