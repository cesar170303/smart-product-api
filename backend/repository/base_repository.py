from sqlmodel import Session, select


class BaseRepository:
    def __init__(self, session: Session, model):
        self.session = session
        self.model = model

    def get_all(self):
        statement = select(self.model)
        return self.session.exec(statement).all()

    def get_by_id(self, item_id: int):
        return self.session.get(self.model, item_id)

    def add(self, item):
        self.session.add(item)
        self.session.commit()
        self.session.refresh(item)

    def update(self, item):
        self.session.merge(item)
        self.session.commit()
        self.session.refresh(item)

    def delete(self, item):
        self.session.delete(item)
        self.session.commit()
