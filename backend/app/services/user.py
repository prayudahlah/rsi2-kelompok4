from app.repositories.user import UserRepository
from app.database.schema.schema import User 


class UserService:

    def __init__(self):
        self.repo = UserRepository()

    def create_user(self, db, user_data):
        user = User(**user_data.dict())
        return self.repo.create(db, user)

    def get_users(self, db):
        return self.repo.get_all(db)

    def get_user(self, db, user_id):
        user = self.repo.get_by_id(db, user_id)
        if not user:
            raise ValueError("User not found")
        return user

    def update_user(self, db, user_id, user_data):
        user = self.repo.get_by_id(db, user_id)
        if not user:
            raise ValueError("User not found")

        user.first_name = user_data.first_name
        user.last_name = user_data.last_name
        user.whatsapp = user_data.whatsapp

        return self.repo.update(db, user)

    def delete_user(self, db, user_id):
        user = self.repo.get_by_id(db, user_id)
        if not user:
            raise ValueError("User not found")

        self.repo.delete(db, user)
        return {"message": "User deleted"}