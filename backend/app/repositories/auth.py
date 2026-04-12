from sqlmodel import Session, select
from app.database.schema.schema import Account, Role, User
from app.dto.auth import AccountRegister


class AuthRepository:
    def __init__(self, session: Session):
        self.session = session

    def get_by_email(self, email: str):
        account = self.session.exec(
            select(Account).where(Account.email == email)
        ).first()

        return account

    def create(self, data: AccountRegister):
        # Check dupe email
        existing_email = self.session.exec(
            select(Account).where(Account.email == data.email)
        ).first()
        if existing_email:
            raise ValueError("Email already registered")

        # Get role id
        role = self.session.exec(
            select(Role).where(Role.name == data.role_name)
        ).first()

        if not role or not role.id:
            raise ValueError("Role doesn't exist")

        # Create User
        new_user = User(
            first_name=data.first_name, last_name=data.last_name, whatsapp=data.whatsapp
        )
        self.session.add(new_user)
        self.session.flush()

        # Create Account
        new_account = Account(
            user_id=new_user.id,  # type: ignore
            role_id=role.id,
            email=data.email,
            username=data.username,
            hashed_password=data.password,
        )
        self.session.add(new_account)
        self.session.commit()
        self.session.refresh(new_account)

        return new_account
