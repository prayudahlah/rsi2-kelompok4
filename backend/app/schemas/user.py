from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class UserCreate(BaseModel):
    first_name: str
    last_name: Optional[str] = None
    whatsapp: Optional[str] = None


class UserResponse(BaseModel):
    id: int
    first_name: str
    last_name: Optional[str]
    whatsapp: Optional[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True