from pydantic import BaseModel
from datetime import datetime
from typing import Optional 


class UserCreate(BaseModel):
    first_name: str
    last_name: str
    whatsapp: str

class UserUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    whatsapp: Optional[str] = None

class UserResponse(BaseModel):
    id: int
    first_name: str
    last_name: str
    whatsapp: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True