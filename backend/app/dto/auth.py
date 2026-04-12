from sqlmodel import SQLModel
from pydantic import EmailStr, field_validator


class AccountRegister(SQLModel):
    # Untuk table account
    email: EmailStr
    username: str
    password: str

    # Untuk table user
    first_name: str
    last_name: str
    whatsapp: str

    # Role enum
    role_name: str = "user"  # Default role ke user

    # Jika tidak valid juga default role ke user
    @field_validator("role_name")
    @classmethod
    def validate_role(cls, v: str) -> str:
        if not v or not v.strip():
            return "user"
        return v.lower()


class AccountLogin(SQLModel):
    email: EmailStr
    password: str


class TokenResponse(SQLModel):
    access_token: str
    token_type: str = "bearer"
    account_id: int
    role: str

    class Config:
        from_attribute = True
