from fastapi import APIRouter, Depends, status
from sqlmodel import Session

from app.database.connection import get_session
from app.controllers.user import UserController
from app.dto.user import UserCreate, UserResponse
from app.utils.security.rbac import require_admin, require_user
from app.database.schema.schema import Account

router = APIRouter(prefix="/users", tags=["User"])


def get_controller(session: Session = Depends(get_session)):
    return UserController(session)


@router.get("/", response_model=list[UserResponse])
def get_all(
    current_user: Account = Depends(require_user),
    controller: UserController = Depends(get_controller),
):
    return controller.get_all()


@router.get("/{id}", response_model=UserResponse)
def get_by_id(
    id: int,
    current_user: Account = Depends(require_user),
    controller: UserController = Depends(get_controller),
):
    return controller.get_by_id(id)


@router.post("/", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def create(
    data: UserCreate,
    current_user: Account = Depends(require_admin),
    controller: UserController = Depends(get_controller),
):
    return controller.create(data)


@router.put("/{item_id}", response_model=UserResponse)
def update(
    id: int,
    data: UserCreate,
    current_user: Account = Depends(require_admin),
    controller: UserController = Depends(get_controller),
):
    return controller.update(id, data)


@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete(
    id: int,
    current_user: Account = Depends(require_admin),
    controller: UserController = Depends(get_controller),
):
    return controller.delete(id)

