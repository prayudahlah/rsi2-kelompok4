from app.dto.role import RoleCreate, RoleUpdate
from app.services.role import RoleService
from sqlmodel import Session


class RoleController:
    def __init__(self, session: Session):
        self.service = RoleService(session)

    def get_all(self):
        return self.service.get_all()

    def get_by_id(self, id: int):
        return self.service.get_by_id(id)

    def create(self, data: RoleCreate):
        return self.service.create(data)

    def update(self, id: int, data: RoleUpdate):
        return self.service.update(id, data)

    def delete(self, id: int):
        self.service.delete(id)