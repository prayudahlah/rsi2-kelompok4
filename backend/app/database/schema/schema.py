from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List


class Role(SQLModel, table=True):
    __tablename__ = "role"

    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(max_length=50, unique=True, index=True)

    accounts: List["Account"] = Relationship(back_populates="role")