from app.repositories.event import EventRepository
from app.dto.event import CreateEvent, EventResponse, UpdateEvent
from sqlmodel import Session
from fastapi import HTTPException


class EventService:
    def __init__(self, session: Session):
        self.repo = EventRepository(session)

    def get_all(self):
        db_items = self.repo.get_all()
        return list(map(EventResponse.model_validate, db_items))

    def get_by_id(self, id: int):
        db_item = self.repo.get_by_id(id)
        if not db_item:
            raise HTTPException(status_code=404, detail="Event not found")

        return EventResponse.model_validate(db_item)

    def create(self, data: CreateEvent):
        if data.ended_at <= data.started_at:
            raise HTTPException(
                status_code=400, detail="ended_at harus setelah started_at"
            )

        db_item = self.repo.create(data.model_dump())
        return EventResponse.model_validate(db_item)

    def update(self, id: int, data: UpdateEvent):
        db_item = self.repo.get_by_id(id)
        if not db_item:
            raise HTTPException(status_code=404, detail="Event not found")

        new_started = data.started_at or db_item.started_at
        new_ended = data.ended_at or db_item.ended_at

        if new_ended <= new_started:
            raise HTTPException(
                status_code=400, detail="ended_at harus setelah started_at"
            )

        update_data = data.model_dump(exclude_unset=True)

        for key, value in update_data.items():
            setattr(db_item, key, value)

        updated = self.repo.update(db_item)
        return EventResponse.model_validate(updated)

    def delete(self, id: int):
        db_item = self.repo.get_by_id(id)
        if not db_item:
            raise HTTPException(status_code=404, detail="Event not found")

        self.repo.delete(db_item)
        return {"message": "Event deleted"}

