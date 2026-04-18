from fastapi import APIRouter, Depends, status
from sqlmodel import Session

from app.database.connection import get_session
from app.controllers.registration import RegistrationController
from app.dto.registration import (
    RegistrationCreate,
    RegistrationResponse,
    RegistrationUpdate,
)
from app.utils.security.rbac import require_admin, require_user
from app.database.schema.schema import Account

router = APIRouter(prefix="/registrations", tags=["Registration"])


def get_controller(session: Session = Depends(get_session)):
    return RegistrationController(session)


@router.get("/", response_model=list[RegistrationResponse])
def get_all(
    current_user: Account = Depends(require_user),
    controller: RegistrationController = Depends(get_controller),
):
    return controller.get_all()


@router.get("/{id}", response_model=RegistrationResponse)
def get_by_id(
    id: int,
    current_user: Account = Depends(require_user),
    controller: RegistrationController = Depends(get_controller),
):
    return controller.get_by_id(id)


@router.post(
    "/", response_model=RegistrationResponse, status_code=status.HTTP_201_CREATED
)
def create(
    data: RegistrationCreate,
    current_user: Account = Depends(require_user),
    controller: RegistrationController = Depends(get_controller),
):
    return controller.create(data)


@router.put("/{id}", response_model=RegistrationResponse)
def update(
    id: int,
    data: RegistrationUpdate,
    current_user: Account = Depends(require_admin),
    controller: RegistrationController = Depends(get_controller),
):
    return controller.update(id, data)


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete(
    id: int,
    current_user: Account = Depends(require_admin),
    controller: RegistrationController = Depends(get_controller),
):
    controller.delete(id)
    return
