from datetime import datetime

from pydantic import BaseModel, ConfigDict


class GuardaviaBase(BaseModel):
    codigo: str
    ubicacion: str
    tipo: str
    estado: str
    observaciones: str | None = None


class GuardaviaCreate(GuardaviaBase):
    pass


class GuardaviaUpdate(BaseModel):
    codigo: str | None = None
    ubicacion: str | None = None
    tipo: str | None = None
    estado: str | None = None
    observaciones: str | None = None


class GuardaviaResponse(GuardaviaBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)