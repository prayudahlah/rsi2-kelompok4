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


@app.middleware("http")
async def strip_api_prefix(request: Request, call_next):
    path = request.url.path
    if path.startswith("/api/"):
        request.scope["path"] = path[4:]
        request.scope["root_path"] = "/api"
    elif path == "/api":
        request.scope["path"] = "/"
        request.scope["root_path"] = "/api"
    return await call_next(request)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://rsi-praktikum.prayudahlah.dev",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(role.router)
app.include_router(registration.router)
app.include_router(account.router)
app.include_router(user.router)
app.include_router(event.router)
app.include_router(auth.router)


@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "milik kelompok 4A :)"}


@app.get("/")
async def root():
    return RedirectResponse(url="/api/health")


# Exception Handlers
@app.exception_handler(IntegrityError)
async def integrity_exception_handler(request: Request, exc: IntegrityError):
    return JSONResponse(
        status_code=400,
        content={"detail": "Data integrity violation", "type": type(exc).__name__},
    )
