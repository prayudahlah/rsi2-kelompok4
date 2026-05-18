from fastapi import APIRouter, Depends
from sqlmodel import Session

from app.database.connection import get_session
from app.database.schema.schema import Account
from app.dto.auth import AccountLogin, AccountRegister, TokenResponse
from app.controllers.auth import AuthController
from app.utils.security.jwt import get_current_user
from pydantic import BaseModel

router = APIRouter(prefix="/auth", tags=["Auth"])


def get_controller(session: Session = Depends(get_session)):
    return AuthController(session)


@router.post("/register", response_model=TokenResponse)
def register(
    data: AccountRegister, controller: AuthController = Depends(get_controller)
):
    return controller.register(data)


@router.post("/login", response_model=TokenResponse)
def login(data: AccountLogin, controller: AuthController = Depends(get_controller)):
    return controller.login(data)


@router.get("/me")
def get_me(current_user: Account = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "username": current_user.username,
        "role": current_user.role.name,
    }



class RefreshBody(BaseModel):
    refresh_token: str


@router.post("/refresh", response_model=TokenResponse)
def refresh(body: RefreshBody, controller: AuthController = Depends(get_controller)):
    return controller.refresh(body.refresh_token)
