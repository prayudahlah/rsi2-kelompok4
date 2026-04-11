from jose import JWTError, jwt
from datetime import timedelta, datetime, timezone

SECRET_KEY = "SECRET_KEY"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRED = 15


def create_access_token(data: dict):
    to_encode = data.copy()
    expired_time = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRED)
    to_encode.update({"exp": expired_time})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def decode_access_token(token: str):
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError:
        return None

