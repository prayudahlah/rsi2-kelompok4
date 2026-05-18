from fastapi import HTTPException
from sqlmodel import Session

from app.dto.auth import AccountLogin, AccountRegister, TokenResponse
from app.utils.security.hash import verify_password, hash_password
from app.utils.security.jwt import create_token, create_refresh_token, verify_refresh_token
from app.repositories.auth import AuthRepository


class AuthService:
    def __init__(self, session: Session):
        self.repo = AuthRepository(session)

    def login(self, data: AccountLogin):
        account = self.repo.get_by_email(data.email)

        if not account or not verify_password(data.password, account.hashed_password):
            raise HTTPException(
                status_code=401,
                detail="Invalid email or password",
            )
        if not account.id:
            raise HTTPException(status_code=500, detail="Invalid account ID")

        access_token = create_token(user_id=account.id)
        refresh_token = create_refresh_token(user_id=account.id)

        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            account_id=account.id,
            role=account.role.name,
        )

    def register(self, data: AccountRegister):
        data.password = hash_password(data.password)
        try:
            new_account = self.repo.create(data)
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))

        access_token = create_token(user_id=new_account.id)  # type: ignore
        refresh_token = create_refresh_token(user_id=new_account.id)  # type: ignore
        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            account_id=new_account.id,  # type: ignore
            role=new_account.role.name,
        )

    def refresh(self, refresh_token: str):
        """Validate a refresh token and return a new TokenResponse with a new access token.
        This is stateless: refresh_token is a JWT signed with REFRESH_SECRET_KEY.
        """
        account_id = verify_refresh_token(refresh_token)

        access_token = create_token(user_id=account_id)
        # Optionally rotate refresh token by issuing a new one
        new_refresh_token = create_refresh_token(user_id=account_id)

        return TokenResponse(
            access_token=access_token,
            refresh_token=new_refresh_token,
            account_id=account_id,
            role="user",  # role is not fetched here; client can call /auth/me if needed
        )
