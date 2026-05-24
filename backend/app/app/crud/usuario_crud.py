from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import hash_password
from app.models.user_model import Usuario
from app.schemas.usuario_schema import UsuarioCreate


async def create_user(db: AsyncSession, user_in: UsuarioCreate) -> Usuario:
    db_user = Usuario(
        nombre=user_in.nombre,
        apellido=user_in.apellido,
        email=user_in.email,
        password_hash=hash_password(user_in.password),
    )
    db.add(db_user)
    await db.commit()
    await db.refresh(db_user)
    return db_user


async def get_user_by_email(db: AsyncSession, email: str) -> Usuario | None:
    result = await db.execute(
        select(Usuario).where(Usuario.email == email)
    )
    return result.scalar_one_or_none()


async def get_user_by_id(db: AsyncSession, user_id: str) -> Usuario | None:
    result = await db.execute(
        select(Usuario).where(Usuario.id_usuario == user_id)
    )
    return result.scalar_one_or_none()