from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List
from datetime import datetime
from pydantic import EmailStr
from sqlalchemy import func

class Role(SQLModel, table=True):
    __tablename__ = "role"

    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(max_length=255, unique=True, index=True)

    accounts: List["Account"] = Relationship(back_populates="role")

class Account(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    role_id: int = Field(foreign_key="role.id")
    email: EmailStr = Field(unique=True)
    username: str = Field(max_length=16)
    password: str

    created_at: datetime = Field(
        default_factory=datetime.now, sa_column_kwargs={"server_default": func.now()}
    )
    updated_at: datetime = Field(
        default_factory=datetime.now,
        sa_column_kwargs={"onupdate": func.now(), "server_default": func.now()},
    )

    user: "User" = Relationship(back_populates="accounts")
    role: "Role" = Relationship(back_populates="accounts")

    logs: list["Log"] = Relationship(back_populates="account")
