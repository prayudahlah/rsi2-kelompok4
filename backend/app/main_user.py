from fastapi import FastAPI
from app.db.database import engine
from app.db.base import Base
from app.models.user import User
from api.routes import user

app = FastAPI()

# 🔥 AUTO BUAT TABEL
Base.metadata.create_all(bind=engine)

app.include_router(user.router)