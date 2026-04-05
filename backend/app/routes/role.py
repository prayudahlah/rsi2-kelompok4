from fastapi import APIRouter, Depends, status
from sqlmodel import Session

from app.database.connection import get_session
from app.controllers.role import RoleController
from app.dto.role import RoleCreate, RoleUpdate, RoleResponse

router = APIRouter(prefix="/roles", tags=["Role"])


def get_controller(session: Session = Depends(get_session)):
    return RoleController(session)


@router.get("/", response_model=list[RoleResponse])
def get_all(controller: RoleController = Depends(get_controller)):
    return controller.get_all()


@router.get("/{id}", response_model=RoleResponse)
def get_by_id(id: int, controller: RoleController = Depends(get_controller)):
    return controller.get_by_id(id)


@router.post("/", response_model=RoleResponse, status_code=status.HTTP_201_CREATED)
def create(data: RoleCreate, controller: RoleController = Depends(get_controller)):
    return controller.create(data)


@router.patch("/{id}", response_model=RoleResponse)
def update(id: int, data: RoleUpdate, controller: RoleController = Depends(get_controller)):
    return controller.update(id, data)


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete(id: int, controller: RoleController = Depends(get_controller)):
    controller.delete(id)