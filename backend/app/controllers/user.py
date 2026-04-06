from app.dto.user import UserCreate
from app.services.user import UserService
from sqlmodel import Session


class UserController:
    def __init__(self, session: Session):
        self.service = UserService(session)

    def get_all(self):
        return self.service.get_all()

    def get_by_id(self, id: int):
        return self.service.get_by_id(id)

    def create(self, data: UserCreate):
        return self.service.create(data)

    def update(self, id: int, data: UserCreate):
        return self.service.update(id, data)

    def delete(self, id: int):
        self.service.delete(id)
