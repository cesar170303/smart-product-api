from models.User import UserModel
from sqlmodel import Session, select

class UserRepository:
    def __init__(self, session: Session):
        self.session = session

    def get_users(self):
        statement = select(UserModel)
        return self.session.exec(statement).all()

    def get_user_by_id(self, user_id: int):
        return self.session.get(UserModel, user_id)
    
    def add_user(self, user: UserModel):
        self.session.add(user)
        self.session.commit()
        self.session.refresh(user)

    def update_user(self, user: UserModel):
        self.session.merge(user)
        self.session.commit()
        self.session.refresh(user)

    def delete_user(self, user: UserModel):
        self.session.delete(user)
        self.session.commit()

    def get_user_by_username(self, username: str):
        statement = select(UserModel).where(UserModel.username == username)
        return self.session.exec(statement).first()