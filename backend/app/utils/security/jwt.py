from datetime import datetime, timedelta, timezone
from jose import jwt
from jose.exceptions import JWTError
from fastapi import HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlmodel import Session

from app.database.connection import get_session
from app.database.schema.schema import Account

SECRET_KEY = "key-rahasia-67"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 15

security = HTTPBearer()


def create_token(user_id: int) -> str:
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    return jwt.encode(
        {"sub": str(user_id), "exp": expire},
        key=SECRET_KEY,
        algorithm=ALGORITHM,
    )


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

    except JWTError, ValueError:
        raise HTTPException(status_code=401, detail="Invalid token")

    account = session.get(Account, account_id)
    if not account:
        raise HTTPException(status_code=401, detail="Account not found")
    return account
