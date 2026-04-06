from sqlmodel import Session
from app.services.registration import RegistrationService
from app.dto.registration import RegistrationCreate, RegistrationUpdate


class RegistrationController:
    def __init__(self, session: Session):
        self.service = RegistrationService(session)

    def get_all(self):
        return self.service.get_all()

    def get_by_id(self, id: int):
        return self.service.get_by_id(id)

    def create(self, data: RegistrationCreate):
        return self.service.create(data)

    def update(self, id: int, data: RegistrationUpdate):
        return self.service.update(id, data)

    def delete(self, id: int):
        return self.service.delete(id)