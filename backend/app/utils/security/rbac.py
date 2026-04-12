from fastapi import Depends, HTTPException, status
from app.database.schema.schema import Account
from app.utils.security.jwt import get_current_user


class Role:
    ADMIN = "admin"
    USER = "user"


# user
def require_user(current_user: Account = Depends(get_current_user)):
    if current_user.role.name not in [Role.USER, Role.ADMIN]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden")
    return current_user


# admin
def require_admin(current_user: Account = Depends(get_current_user)):
    if current_user.role.name != Role.ADMIN:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden")
    return current_user
