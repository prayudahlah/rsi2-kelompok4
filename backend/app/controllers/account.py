from app.dto.account import AccountCreate
from app.services.account import AccountService
from sqlmodel import Session


class AccountController:
    def __init__(self, session: Session):
        self.service = AccountService(session)

    def get_all(self):
        return self.service.get_all()

    def get_by_id(self, id: int):
        return self.service.get_by_id(id)

    def create(self, data: AccountCreate):
        return self.service.create(data)

    def update(self, id: int, data: AccountCreate):
        return self.service.update(id, data)

    def delete(self, id: int):
        return self.service.delete(id)
