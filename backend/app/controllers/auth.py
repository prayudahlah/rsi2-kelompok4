from fastapi import APIRouter, Depends
from sqlmodel import Session

from app.database.connection import get_session
from app.dto.auth import AccountLogin, AccountRegister, TokenResponse
from app.services.auth import AuthService

router = APIRouter(prefix="/auth", tags=["Auth"])


def get_service(session: Session = Depends(get_session)):
    return AuthService(session)


@router.post("/register", response_model=TokenResponse)
def register(data: AccountRegister, service: AuthService = Depends(get_service)):
    return service.register(data)


@router.post("/login", response_model=TokenResponse)
def login(data: AccountLogin, service: AuthService = Depends(get_service)):
    return service.login(data)