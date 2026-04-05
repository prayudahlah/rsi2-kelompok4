from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from app.database.connection import get_session
from app.services.user import UserService
from app.dto.user import UserCreate, UserResponse, UserUpdate

router = APIRouter(prefix="/users", tags=["User"])

service = UserService()


@router.post("/", response_model=UserResponse)
def create_user(user: UserCreate, db: Session = Depends(get_session)):
    return service.create_user(db, user)


@router.get("/", response_model=list[UserResponse])
def get_users(db: Session = Depends(get_session)):
    return service.get_users(db)


@router.get("/{user_id}", response_model=UserResponse)
def get_user(user_id: int, db: Session = Depends(get_session)):
    try:
        return service.get_user(db, user_id)
    except ValueError:
        raise HTTPException(status_code=404, detail="User not found")


@router.put("/{user_id}", response_model=UserResponse)
def update_user(user_id: int, user: UserUpdate, db: Session = Depends(get_session)):
    return service.update_user(db, user_id, user)

@router.delete("/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_session)):
    try:
        return service.delete_user(db, user_id)
    except ValueError:
        raise HTTPException(status_code=404, detail="User not found")