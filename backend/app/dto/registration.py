from sqlmodel import SQLModel
from typing import Optional


class RegistrationBase(SQLModel):
    user_id: int
    event_id: int


class RegistrationCreate(RegistrationBase):
    pass


class RegistrationCreateRequest(SQLModel):
    event_id: int


class RegistrationUpdate(SQLModel):
    user_id: Optional[int] = None
    event_id: Optional[int] = None


class RegistrationResponse(RegistrationBase):
    id: int

    class Config:
        from_attributes = True
