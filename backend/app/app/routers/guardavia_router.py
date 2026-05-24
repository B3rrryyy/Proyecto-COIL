from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.connection import get_db
from app.crud.guardavia_crud import (
    create_guardavia,
    delete_guardavia,
    get_all_guardavias,
    get_guardavia_by_id,
    update_guardavia,
)
from app.schemas.ficha_schema import (
    GuardaviaCreate,
    GuardaviaResponse,
    GuardaviaUpdate,
)

router = APIRouter(prefix="/guardavias", tags=["Guardavias"])


@router.post("/", response_model=GuardaviaResponse, status_code=status.HTTP_201_CREATED)
async def create(
    data: GuardaviaCreate,
    db: AsyncSession = Depends(get_db),
):
    return await create_guardavia(db, data)


@router.get("/", response_model=list[GuardaviaResponse])
async def get_all(db: AsyncSession = Depends(get_db)):
    return await get_all_guardavias(db)


@router.get("/{guardavia_id}", response_model=GuardaviaResponse)
async def get_one(
    guardavia_id: str,
    db: AsyncSession = Depends(get_db),
):
    obj = await get_guardavia_by_id(db, guardavia_id)

    if not obj:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Guardavía no encontrada",
        )

    return obj


@router.put("/{guardavia_id}", response_model=GuardaviaResponse)
async def update(
    guardavia_id: str,
    data: GuardaviaUpdate,
    db: AsyncSession = Depends(get_db),
):
    updated = await update_guardavia(db, guardavia_id, data)

    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Guardavía no encontrada",
        )

    return updated


@router.delete("/{guardavia_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete(
    guardavia_id: str,
    db: AsyncSession = Depends(get_db),
):
    ok = await delete_guardavia(db, guardavia_id)

    if not ok:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Guardavía no encontrada",
        )