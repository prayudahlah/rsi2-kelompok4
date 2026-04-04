from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List


class Role(SQLModel, table=True):
    __tablename__ = "role"

    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(max_length=255, unique=True, index=True)

    accounts: List["Account"] = Relationship(back_populates="role")

class Registration(SQLModel, table=True):
    __tablename__ = "registration"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    event_id: int = Field(foreign_key="event.id")

    user: "User" = Relationship(back_populates="registrations")
    event: "Event" = Relationship(back_populates="registrations")