from datetime import datetime
from pydantic import BaseModel, ValidationInfo, field_validator


class EventCreate(BaseModel):
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

    @field_validator("ended_at")
    def validate_timeventend(cls, v, info: ValidationInfo):
        started_at = info.data.get("started_at")
        if started_at and v <= started_at:
            raise ValueError("waktu berakhir event harus lebih dari waktu mulai")
        return v


class EventResponse(BaseModel):
    id: str
    description: str
    quota: int
    started_at: datetime
    ended_at: datetime
