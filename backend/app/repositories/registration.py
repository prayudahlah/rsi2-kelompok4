from sqlmodel import Session, select
from app.database.schema.schema import Registration


class RegistrationRepository:
    def __init__(self, session: Session):
        self.session = session
        self.model = Registration

    def get_all(self):
        return self.session.exec(select(self.model)).all()

    def get_by_id(self, id: int):
        return self.session.get(self.model, id)

    def create(self, data: dict):
        db_obj = self.model(**data)
        self.session.add(db_obj)
        self.session.commit()
        self.session.refresh(db_obj)
        return db_obj

    def update(self, id: int, data: dict):
        db_obj = self.get_by_id(id)
        if not db_obj:
            return None

        for key, value in data.items():
            if value is not None:
                setattr(db_obj, key, value)

        self.session.add(db_obj)
        self.session.commit()
        self.session.refresh(db_obj)

        return db_obj

    def delete(self, id: int):
        db_obj = self.get_by_id(id)
        if not db_obj:
            return False

        self.session.delete(db_obj)
        self.session.commit()
        return True