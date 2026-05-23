from sqlalchemy.ext.asyncio import (
    create_async_engine,
    async_sessionmaker,
    AsyncSession
)

from typing import AsyncGenerator

DATABASE_URL = "postgresql+asyncpg://postgres:C01l123_..ji@db.ovvkswgmeaudxqdvqoaa.supabase.co:5432/postgres"

engine = create_async_engine(
    DATABASE_URL,
    echo=True
)

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False
)

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        yield session