from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.guardavia import Guardavia
from app.schemas.ficha_schema import GuardaviaCreate, GuardaviaUpdate


async def create_guardavia(
    db: AsyncSession,
    data: GuardaviaCreate,
    usuario_id: str | None = None,
) -> Guardavia:
    db_obj = Guardavia(
        fecha=data.fecha,
        provincia=data.provincia,
        canton=data.canton,
        parroquia=data.parroquia,
        tramo_via=data.tramo_via,
        observaciones=data.observaciones,
        usuario_id=usuario_id,
    )

    db.add(db_obj)
    await db.commit()
    await db.refresh(db_obj)

    return db_obj


async def get_guardavia_by_id(
    db: AsyncSession,
    guardavia_id: str,
) -> Guardavia | None:
    result = await db.execute(
        select(Guardavia).where(Guardavia.id == guardavia_id)
    )
    return result.scalar_one_or_none()


async def get_all_guardavias(db: AsyncSession) -> list[Guardavia]:
    result = await db.execute(select(Guardavia))
    return list(result.scalars().all())


async def update_guardavia(
    db: AsyncSession,
    guardavia_id: str,
    data: GuardaviaUpdate,
) -> Guardavia | None:
    db_obj = await get_guardavia_by_id(db, guardavia_id)

    if not db_obj:
        return None

    update_data = data.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(db_obj, key, value)

    await db.commit()
    await db.refresh(db_obj)

    return db_obj


async def delete_guardavia(
    db: AsyncSession,
    guardavia_id: str,
) -> bool:
    db_obj = await get_guardavia_by_id(db, guardavia_id)

    if not db_obj:
        return False

    await db.delete(db_obj)
    await db.commit()

    return True