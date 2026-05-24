from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers.auth_router import router as auth_router
from app.routers.guardavia_router import router as guardavia_router

app = FastAPI(
    title="Sistema de Gestión de Infraestructura Vial",
    version="1.0.0",
)

# CORS (React + Vite)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth_router)
app.include_router(guardavia_router)


@app.get("/")
async def root():
    return {
        "message": "API de infraestructura vial activa"
    }