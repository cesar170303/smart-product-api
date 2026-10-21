from sqlmodel import Field, SQLModel


class UserBase(SQLModel):
    username: str = Field(unique=True, index=True, min_length=3)


class UserModel(UserBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    hashed_password: str


class UserCreate(UserBase):
    password: str = Field(min_length=6)


class UserPublic(UserBase):
    id: int


class UserRegisterResponse(SQLModel):
    mensaje: str
    usuario: UserPublic
