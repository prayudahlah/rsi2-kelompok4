from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from sqlalchemy.exc import IntegrityError
from starlette.requests import Request
from starlette.responses import JSONResponse
from app.routes import registration
from app.routes import role
from app.routes import event
from app.routes import account
from app.routes import user
from app.routes import auth

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(role.router, prefix="/api")
app.include_router(registration.router, prefix="/api")
app.include_router(account.router, prefix="/api")
app.include_router(user.router, prefix="/api")
app.include_router(event.router, prefix="/api")
app.include_router(auth.router, prefix="/api")


@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "milik kelompok 4A :)"}


@app.get("/")
async def root():
    return RedirectResponse(url="/health")


# Exception Handlers
@app.exception_handler(IntegrityError)
async def integrity_exception_handler(request: Request, exc: IntegrityError):
    return JSONResponse(
        status_code=400,
        content={"detail": "Data integrity violation", "type": type(exc).__name__},
    )
