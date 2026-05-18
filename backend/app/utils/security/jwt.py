from datetime import datetime, timedelta, timezone
import os

from jose import jwt
from jose.exceptions import JWTError
from fastapi import HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlmodel import Session

from app.database.connection import get_session
from app.database.schema.schema import Account

# Read secrets from environment, fall back to safe defaults for local dev
SECRET_KEY = os.getenv("SECRET_KEY", "key-rahasia-67")
REFRESH_SECRET_KEY = os.getenv("REFRESH_SECRET_KEY", "refresh-key-rahasia-67")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "15"))
REFRESH_TOKEN_EXPIRE_DAYS = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", "30"))

security = HTTPBearer()


def create_token(user_id: int) -> str:
    """Create an access token (short lived)."""
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    return jwt.encode(
        {"sub": str(user_id), "exp": expire},
        key=SECRET_KEY,
        algorithm=ALGORITHM,
    )


def create_refresh_token(user_id: int) -> str:
    """Create a refresh token (longer lived) signed with a separate secret."""
    expire = datetime.now(timezone.utc) + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    return jwt.encode(
        {"sub": str(user_id), "exp": expire},
        key=REFRESH_SECRET_KEY,
        algorithm=ALGORITHM,
    )


def verify_refresh_token(token: str) -> int:
    """Verify refresh token and return account id."""
    try:
        payload = jwt.decode(token, REFRESH_SECRET_KEY, algorithms=[ALGORITHM])
        account_id_str = payload.get("sub")
        if account_id_str is None:
            raise HTTPException(status_code=401, detail="Invalid refresh token payload")
        return int(account_id_str)
    except (JWTError, ValueError):
        raise HTTPException(status_code=401, detail="Invalid refresh token")


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    session: Session = Depends(get_session),
) -> Account:
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        account_id_str = payload.get("sub")

        if account_id_str is None:
            raise HTTPException(status_code=401, detail="Invalid token payload")

        account_id = int(account_id_str)

    except (JWTError, ValueError):
        raise HTTPException(status_code=401, detail="Invalid token")

    account = session.get(Account, account_id)
    if not account:
        raise HTTPException(status_code=401, detail="Account not found")
    return account
