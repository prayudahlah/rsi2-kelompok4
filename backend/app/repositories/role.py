from sqlmodel import Session, select
from app.database.schema.schema import Role


class RoleRepository:
    def __init__(self, session: Session):
        self.session = session
        self.model = Role

    def get_all(self):
        statement = select(self.model)
        return self.session.exec(statement).all()

    def get_by_id(self, id: int):
        return self.session.get(self.model, id)

    def create(self, data: dict):
        db_obj = self.model(**data)
        self.session.add(db_obj)
        self.session.commit()
        self.session.refresh(db_obj)
        return db_obj

    def update(self, db_obj: Role):
        self.session.commit()
        self.session.refresh(db_obj)
        return db_obj

    def delete(self, db_obj: Role):
        self.session.delete(db_obj)
        self.session.commit()