from pydantic import BaseModel, EmailStr


class AuthRequest(BaseModel):
    email: EmailStr
    password: str


class TokenRespons(BaseModel):
    access_token: str
    token_type: str = "bearer"

    class Config:
        from_atribute = True
