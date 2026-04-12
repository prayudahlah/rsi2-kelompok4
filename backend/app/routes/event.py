from fastapi import APIRouter, Depends, status
from sqlmodel import Session

from app.database.connection import get_session
from app.controllers.event import EventController
from app.dto.event import EventCreate, UpdateEvent, EventResponse
from app.utils.security.jwt import get_current_user
from app.database.schema.schema import Account

router = APIRouter(prefix="/events", tags=["Event"])


def get_controller(session: Session = Depends(get_session)):
    return EventController(session)


@router.get("/", response_model=list[EventResponse])
def get_all(
    current_user: Account = Depends(get_current_user),
    controller: EventController = Depends(get_controller),
):
    return controller.get_all()


@router.get("/{id}", response_model=EventResponse)
def get_by_id(
    id: int,
    current_user: Account = Depends(get_current_user),
    controller: EventController = Depends(get_controller),
):
    return controller.get_by_id(id)


@router.post("/", response_model=EventResponse, status_code=status.HTTP_201_CREATED)
def create(
    data: EventCreate,
    current_user: Account = Depends(get_current_user),
    controller: EventController = Depends(get_controller),
):
    return controller.create(data)


@router.put("/{id}", response_model=EventResponse)
def update(
    id: int,
    data: UpdateEvent,
    current_user: Account = Depends(get_current_user),
    controller: EventController = Depends(get_controller),
):
    return controller.update(id, data)


@router.delete("/{id}", status_code=status.HTTP_200_OK)
def delete(
    id: int,
    current_user: Account = Depends(get_current_user),
    controller: EventController = Depends(get_controller),
):
    return controller.delete(id)