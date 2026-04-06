from datetime import datetime
from pydantic import BaseModel, field_validator


class EventCreated(BaseModel):
    name: str
    description: str
    quota: int
    started_at: datetime
    ended_at: datetime

    @field_validator("quota")
    def validate_quota(cls, v):
        if v <= 0:
            raise ValueError("Quota event harus lebih dari 0")
        return v


class EventReturn(BaseModel):
    id: str
    description: str
    quota: int
    started_at: datetime
    ended_at: datetime
