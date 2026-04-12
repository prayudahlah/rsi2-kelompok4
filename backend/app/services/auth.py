from fastapi import HTTPException
from sqlmodel import Session

from app.dto.auth import AccountLogin, AccountRegister, TokenResponse
from app.utils.security.hash import verify_password, hash_password
from app.utils.security.jwt import create_access_token
from app.repositories.auth import AuthRepository


class AuthService:
    def __init__(self, session: Session):
        self.repo = AuthRepository(session)

    def login(self, data: AccountLogin):
        account = self.repo.get_by_email(data.email)

        if not account:
            raise HTTPException(status_code=404, detail="Account not found")

        if not verify_password(data.password, account.hashed_password):
            raise HTTPException(status_code=401, detail="Wrong password")

        if not account.id:
            raise HTTPException(status_code=500, detail="Invalid account ID")

        token = create_access_token({"sub": str(account.id)})

        return TokenResponse(access_token=token, account_id=account.id)

    def register(self, data: AccountRegister):
        data.password = hash_password(data.password)
        try:
            self.repo.create(data)
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))

        return self.login(AccountLogin(email=data.email, password=data.password))
