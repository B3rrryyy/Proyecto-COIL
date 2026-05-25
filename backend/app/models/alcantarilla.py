import uuid
from datetime import datetime

from sqlalchemy import Date, DateTime, ForeignKey, String, Text, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base


class Alcantarilla(Base):
    __tablename__ = "alcantarillas"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    fecha: Mapped[datetime] = mapped_column(Date, nullable=False)

    provincia: Mapped[str] = mapped_column(String(120), nullable=False)
    canton: Mapped[str] = mapped_column(String(120), nullable=False)
    parroquia: Mapped[str] = mapped_column(String(120), nullable=False)

    via: Mapped[str] = mapped_column(String(255), nullable=False)

    tipo: Mapped[str] = mapped_column(String(100), nullable=False)
    estado: Mapped[str] = mapped_column(String(100), nullable=False)

    observaciones: Mapped[str | None] = mapped_column(Text, nullable=True)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    usuario_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
    )