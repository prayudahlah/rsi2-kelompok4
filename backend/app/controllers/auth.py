from sqlmodel import Session
from app.dto.auth import AccountLogin, AccountRegister
from app.services.auth import AuthService


class AuthController:
    def __init__(self, session: Session):
        self.service = AuthService(session)

    def register(self, data: AccountRegister):
        return self.service.register(data)

    def login(self, data: AccountLogin):
        return self.service.login(data)
