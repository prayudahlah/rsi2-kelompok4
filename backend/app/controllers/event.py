from sqlmodel import Session

from app.services.event import EventService
from app.dto.event import EventCreate, UpdateEvent


class EventController:
    def __init__(self, session: Session):
        self.service = EventService(session)

    def get_all(self):
        return self.service.get_all()

    def get_by_id(self, id: int):
        return self.service.get_by_id(id)

    def create(self, data: EventCreate):
        return self.service.create(data)

    def update(self, id: int, data: UpdateEvent):
        return self.service.update(id, data)

    def delete(self, id: int):
        return self.service.delete(id)
