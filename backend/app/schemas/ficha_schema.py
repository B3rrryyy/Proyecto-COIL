from datetime import datetime
from pydantic import BaseModel, ConfigDict


# =========================
# GUARDAVIA
# =========================

class GuardaviaCreate(BaseModel):
    fecha: datetime
    provincia: str
    canton: str
    parroquia: str
    tramo_via: str
    observaciones: str | None = None


class GuardaviaUpdate(BaseModel):
    fecha: datetime | None = None
    provincia: str | None = None
    canton: str | None = None
    parroquia: str | None = None
    tramo_via: str | None = None
    observaciones: str | None = None


class GuardaviaResponse(GuardaviaCreate):
    id: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# =========================
# ALCANTARILLA
# =========================

class AlcantarillaCreate(BaseModel):
    fecha: datetime
    provincia: str
    canton: str
    parroquia: str
    via: str
    tipo: str
    estado: str
    observaciones: str | None = None


class AlcantarillaUpdate(BaseModel):
    fecha: datetime | None = None
    provincia: str | None = None
    canton: str | None = None
    parroquia: str | None = None
    via: str | None = None
    tipo: str | None = None
    estado: str | None = None
    observaciones: str | None = None


class AlcantarillaResponse(AlcantarillaCreate):
    id: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# =========================
# SEÑALIZACIÓN
# =========================

class SenalizacionCreate(BaseModel):
    fecha: datetime
    provincia: str
    canton: str
    parroquia: str
    via: str
    tipo_senal: str
    estado: str
    ubicacion_especifica: str | None = None
    observaciones: str | None = None


class SenalizacionUpdate(BaseModel):
    fecha: datetime | None = None
    provincia: str | None = None
    canton: str | None = None
    parroquia: str | None = None
    via: str | None = None
    tipo_senal: str | None = None
    estado: str | None = None
    ubicacion_especifica: str | None = None
    observaciones: str | None = None


class SenalizacionResponse(SenalizacionCreate):
    id: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)