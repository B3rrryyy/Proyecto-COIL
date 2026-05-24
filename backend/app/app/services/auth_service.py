from datetime import timedelta

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.security import create_access_token, verify_password
from app.crud.usuario_crud import create_user, get_user_by_email
from app.schemas.auth_schema import LoginRequest
from app.schemas.usuario_schema import UsuarioCreate


async def register_user(db: AsyncSession, user_in: UsuarioCreate):
    existing_user = await get_user_by_email(db, user_in.email)

    if existing_user:
        return None

    return await create_user(db, user_in)


async def login_user(db: AsyncSession, credentials: LoginRequest):
    user = await get_user_by_email(db, credentials.email)

    if not user:
        return None

    if not verify_password(credentials.password, user.password_hash):
        return None

    token = create_access_token(
        data={"sub": str(user.id_usuario)},
        expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES),
    )

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": user,
    }