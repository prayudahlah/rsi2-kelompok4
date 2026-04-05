from sqlmodel import Session, select
from app.database.schema.schema import User


class UserRepository:

    def create(self, db: Session, user: User):
        db.add(user)
        db.commit()
        db.refresh(user)
        return user

    def get_all(self, db: Session):
        return db.exec(select(User)).all()

    def get_by_id(self, db: Session, user_id: int):
        return db.get(User, user_id)

    def update(self, db: Session, user: User):
        db.add(user)
        db.commit()
        db.refresh(user)
        return user

    def delete(self, db: Session, user: User):
        db.delete(user)
        db.commit()