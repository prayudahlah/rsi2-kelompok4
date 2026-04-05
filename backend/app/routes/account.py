from fastapi import APIRouter, Depends, status
from sqlmodel import Session

from app.database.connection import get_session
from app.controllers.account import AccountController
from app.dto.account import AccountCreate, AccountResponse

router = APIRouter(prefix="/accounts", tags=["Account"])


def get_controller(session: Session = Depends(get_session)):
    return AccountController(session)


@router.get("/", response_model=list[AccountResponse])
def get_all(controller: AccountController = Depends(get_controller)):
    return controller.get_all()


@router.get("/{id}", response_model=AccountResponse)
def get_by_id(id: int, controller: AccountController = Depends(get_controller)):
    return controller.get_by_id(id)


@router.post("/", response_model=AccountResponse, status_code=status.HTTP_201_CREATED)
def create(
    data: AccountCreate, controller: AccountController = Depends(get_controller)
):
    return controller.create(data)


@router.put("/{item_id}", response_model=AccountResponse)
def update(
    id: int,
    data: AccountCreate,
    controller: AccountController = Depends(get_controller),
):
    return controller.update(id, data)


@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete(id: int, controller: AccountController = Depends(get_controller)):
    return controller.delete(id)
