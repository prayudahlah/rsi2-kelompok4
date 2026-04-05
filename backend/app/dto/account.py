from sqlmodel import SQLModel
from datetime import datetime
from pydantic import EmailStr


class AccountBase(SQLModel):
    user_id: int
    role_id: int
    email: EmailStr
    username: str


class AccountCreate(AccountBase):
    password: str
    pass


class AccountResponse(AccountBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
