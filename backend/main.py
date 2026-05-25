from fastapi import FastAPI
from app.routes.auth import router as auth_router

app = FastAPI(
    title="COIL Backend",
    version="1.0.0"
)

app.include_router(auth_router)
