from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.schemas.user import UserCreate, UserResponse
from app.crud import user as crud_user

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/users", response_model=UserResponse)
def create(user: UserCreate, db: Session = Depends(get_db)):
    return crud_user.create_user(db, user)


@router.get("/users", response_model=list[UserResponse])
def read_all(db: Session = Depends(get_db)):
    return crud_user.get_users(db)