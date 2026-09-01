"""Image model -- stores AES-encrypted image data and metadata."""

from datetime import datetime, timezone

from models import db


class Image(db.Model):
    """Encrypted image record."""

    __tablename__ = "images"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    original_filename = db.Column(db.String(255), nullable=False)
    mime_type = db.Column(db.String(64), nullable=False)
    file_size = db.Column(db.BigInteger, nullable=False)
    encrypted_data = db.Column(db.LargeBinary(length=(1 << 32) - 1), nullable=False)  # LONGBLOB
    iv = db.Column(db.String(64), nullable=False)
    encrypted_thumbnail = db.Column(db.LargeBinary(length=4 * 1024 * 1024), nullable=True)  # MEDIUMBLOB
    thumbnail_iv = db.Column(db.String(64), nullable=True)
    description = db.Column(db.Text, nullable=True)
    tags = db.Column(db.String(512), nullable=True)
    created_at = db.Column(
        db.DateTime, nullable=False, default=lambda: datetime.now(timezone.utc)
    )
    updated_at = db.Column(
        db.DateTime,
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    def __repr__(self) -> str:
        return f"<Image {self.id} - {self.original_filename}>"
