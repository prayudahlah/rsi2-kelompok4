from app.repositories.account import AccountRepository
from app.dto.account import AccountCreate, AccountResponse
from sqlmodel import Session
from fastapi import HTTPException


class AccountService:
    def __init__(self, session: Session):
        self.repo = AccountRepository(session)

    def get_all(self):
        db_items = self.repo.get_all()
        return [AccountResponse.model_validate(item) for item in db_items]

    def get_by_id(self, id: int):
        db_item = self.repo.get_by_id(id)
        if not db_item:
            raise HTTPException(status_code=404, detail="Item not found")
        return AccountResponse.model_validate(db_item)

    def create(self, data: AccountCreate):
        item_dict = data.model_dump()
        db_item = self.repo.create(item_dict)

        return AccountResponse.model_validate(db_item)

    def update(self, id: int, data: AccountCreate):
        update_dict = data.model_dump()

        db_item = self.repo.update(id, update_dict)
        if not db_item:
            raise HTTPException(status_code=404, detail="Account not found")

        return AccountResponse.model_validate(db_item)

    def delete(self, id: int):
        deleted = self.repo.delete(id)

        if not deleted:
            raise HTTPException(status_code=404, detail="Account not found")

        return True
