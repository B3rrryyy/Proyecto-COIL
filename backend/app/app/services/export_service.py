import csv
import io

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.alcantarilla import Alcantarilla
from app.models.guardavia import Guardavia
from app.models.senalizacion import Senalizacion


async def export_guardavias_csv(db: AsyncSession) -> str:
    result = await db.execute(select(Guardavia))
    rows = result.scalars().all()

    output = io.StringIO()
    writer = csv.writer(output)

    writer.writerow(
        [
            "id",
            "fecha",
            "provincia",
            "canton",
            "parroquia",
            "tramo_via",
            "observaciones",
            "created_at",
        ]
    )

    for r in rows:
        writer.writerow(
            [
                r.id,
                r.fecha,
                r.provincia,
                r.canton,
                r.parroquia,
                r.tramo_via,
                r.observaciones,
                r.created_at,
            ]
        )

    return output.getvalue()


async def export_alcantarillas_csv(db: AsyncSession) -> str:
    result = await db.execute(select(Alcantarilla))
    rows = result.scalars().all()

    output = io.StringIO()
    writer = csv.writer(output)

    writer.writerow(
        [
            "id",
            "fecha",
            "provincia",
            "canton",
            "parroquia",
            "via",
            "tipo",
            "estado",
            "observaciones",
            "created_at",
        ]
    )

    for r in rows:
        writer.writerow(
            [
                r.id,
                r.fecha,
                r.provincia,
                r.canton,
                r.parroquia,
                r.via,
                r.tipo,
                r.estado,
                r.observaciones,
                r.created_at,
            ]
        )

    return output.getvalue()


async def export_senalizaciones_csv(db: AsyncSession) -> str:
    result = await db.execute(select(Senalizacion))
    rows = result.scalars().all()

    output = io.StringIO()
    writer = csv.writer(output)

    writer.writerow(
        [
            "id",
            "fecha",
            "provincia",
            "canton",
            "parroquia",
            "via",
            "tipo_senal",
            "estado",
            "ubicacion_especifica",
            "observaciones",
            "created_at",
        ]
    )

    for r in rows:
        writer.writerow(
            [
                r.id,
                r.fecha,
                r.provincia,
                r.canton,
                r.parroquia,
                r.via,
                r.tipo_senal,
                r.estado,
                r.ubicacion_especifica,
                r.observaciones,
                r.created_at,
            ]
        )

    return output.getvalue()