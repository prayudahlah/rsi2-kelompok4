from sqlmodel import Session, select
from app.database.schema.schema import Account


class AuthRepository:
    def __init__(self, session: Session):
        self.session = session

    def get_by_email(self, email: str):
        return self.session.exec(select(Account).where(Account.email == email)).first()

    def create(self, data: dict):
        db_obj = Account(**data)
        self.session.add(db_obj)
        self.session.commit()
        self.session.refresh(db_obj)
        return db_obj
