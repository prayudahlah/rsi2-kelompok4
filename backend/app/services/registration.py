from sqlmodel import Session
from fastapi import HTTPException
from app.repositories.registration import RegistrationRepository
from app.dto.registration import (
    RegistrationCreate,
    RegistrationResponse,
    RegistrationUpdate,
)


class RegistrationService:
    def __init__(self, session: Session):
        self.repo = RegistrationRepository(session)

    def get_all(self):
        return [
            RegistrationResponse.model_validate(item)
            for item in self.repo.get_all()
        ]

    def get_by_id(self, id: int):
        db_item = self.repo.get_by_id(id)
        if not db_item:
            raise HTTPException(status_code=404, detail="Registration not found")

        return RegistrationResponse.model_validate(db_item)

    def create(self, data: RegistrationCreate):
        return RegistrationResponse.model_validate(
            self.repo.create(data.model_dump())
        )

    def update(self, id: int, data: RegistrationUpdate):
        db_obj = self.repo.update(id, data.model_dump())

        if not db_obj:
            raise HTTPException(status_code=404, detail="Registration not found")

        return RegistrationResponse.model_validate(db_obj)

    def delete(self, id: int):
        deleted = self.repo.delete(id)
        if not deleted:
            raise HTTPException(status_code=404, detail="Registration not found")

        return True