from app.repositories.role import RoleRepository
from app.dto.role import RoleCreate, RoleUpdate, RoleResponse
from sqlmodel import Session
from fastapi import HTTPException


class RoleService:
    def __init__(self, session: Session):
        self.repo = RoleRepository(session)

    def get_all(self):
        db_items = self.repo.get_all()
        return list(map(RoleResponse.model_validate, db_items))

    def get_by_id(self, id: int):
        db_item = self.repo.get_by_id(id)
        if not db_item:
            raise HTTPException(status_code=404, detail="Role not found")

        return RoleResponse.model_validate(db_item)

    def create(self, data: RoleCreate):
        db_item = self.repo.create(data.model_dump())
        return RoleResponse.model_validate(db_item)

    def update(self, id: int, data: RoleUpdate):
        db_item = self.repo.get_by_id(id)

        if not db_item:
            raise HTTPException(status_code=404, detail="Role not found")

        update_data = data.model_dump(exclude_unset=True)

        for key, value in update_data.items():
            setattr(db_item, key, value)

        updated = self.repo.update(db_item)
        return RoleResponse.model_validate(updated)

    def delete(self, id: int):
        db_item = self.repo.get_by_id(id)

        if not db_item:
            raise HTTPException(status_code=404, detail="Role not found")

        self.repo.delete(db_item)