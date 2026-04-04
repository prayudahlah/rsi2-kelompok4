from datetime import datetime
from sqlmodel import SQLModel, Field, Relationship, func
from typing import Optional


class Event(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True, nullable=False)
    name: str = Field(max_length=255, nullable=False)
    description: str = Field(max_length=255, nullable=False)
    quota: int = Field(nullable=False)
    started_at: datetime = Field(nullable=False)
    ended_at: datetime = Field(nullable=False)
    created_at: datetime = Field(
        default_factory=datetime.now,
        sa_column_kwargs={"server_default": func.now()},
        nullable=False,
    )
    update_at: datetime = Field(
        default_factory=datetime.now,
        sa_column_kwargs={"server_default": func.now()},
        nullable=False,
    )

    registration: "Registration" = Relationship(back_populates="event")


class Logs(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True, nullable=False)
    account_id: int = Field(foreign_key="account_id")
    created_at: datetime = Field(
        default_factory=datetime.now,
        sa_column_kwargs={"server_default": func.now()},
        nullable=False,
    )
    action: str = Field(max_length=15, nullable=False)
    ip_address: str = Field(max_length=25, nullable=False)
    user_agent: str = Field(max_length=50, nullable=False)
    entity: str = Field(max_length=50, nullable=False)
    entity_id: int = Field(nullable=False)

    account: "Account" = Relationship(back_populates="logs")
    updated_at: datetime = Field(
        default_factory=datetime.now,
        sa_column_kwargs={"onupdate": func.now(), "server_default": func.now()},
    )

    user: "User" = Relationship(back_populates="accounts")
    role: "Role" = Relationship(back_populates="accounts")

    logs: list["Log"] = Relationship(back_populates="account")
