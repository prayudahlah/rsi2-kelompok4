from datetime import datetime, timezone
from sqlmodel import SQLModel, Field, Relationship, func
from typing import Optional


class Event(SQLModel, table=True):

    id: Optional[int]= Field(default=None, primary_key=True, nullable=False)
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
