from sqlmodel import SQLModel
from typing import Optional


class RoleBase(SQLModel):
    name: str


class RoleCreate(RoleBase):
    pass


class RoleUpdate(SQLModel):
    name: Optional[str] = None


class RoleResponse(RoleBase):
    id: int

    class Config:
        from_attributes = True