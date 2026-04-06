from sqlmodel import SQLModel
from datetime import datetime
from typing import Optional


class UserBase(SQLModel):
    first_name: str
    last_name: str
    whatsapp: str


class UserCreate(UserBase):
    pass


class UserResponse(UserBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

