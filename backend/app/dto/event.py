from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class CreateEvent(BaseModel):
    name: str
    description: str
    quota: int
    started_at: datetime
    ended_at: datetime


class EventResponse(BaseModel):
    id: int
    name: str
    description: str
    quota: int
    started_at: datetime
    ended_at: datetime

    class Config:
        from_attributes = True


class UpdateEvent(BaseModel):
    name: Optional[str]
    description: Optional[str]
    quota: Optional[int]
    started_at: Optional[datetime]
    ended_at: Optional[datetime]
