from pydantic import BaseModel, EmailStr, ConfigDict


class UsuarioCreate(BaseModel):
    nombre: str
    apellido: str | None = None
    email: EmailStr
    password: str


class UsuarioResponse(BaseModel):
    nombre: str
    apellido: str | None = None
    email: EmailStr
    is_active: bool

    model_config = ConfigDict(from_attributes=True)