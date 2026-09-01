"""Admin model -- stores administrator credentials with Argon2 hashing."""

from datetime import datetime, timezone

from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError

from models import db

_ph = PasswordHasher()


class Admin(db.Model):
    """Administrator account."""

    __tablename__ = "admin"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(64), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(256), nullable=False)
    created_at = db.Column(
        db.DateTime, nullable=False, default=lambda: datetime.now(timezone.utc)
    )
    updated_at = db.Column(
        db.DateTime,
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    # -- password helpers ---------------------------------------------------

    def set_password(self, raw_password: str) -> None:
        """Hash *raw_password* with Argon2 and store it."""
        self.password_hash = _ph.hash(raw_password)

    def check_password(self, raw_password: str) -> bool:
        """Return ``True`` if *raw_password* matches the stored hash."""
        try:
            return _ph.verify(self.password_hash, raw_password)
        except VerifyMismatchError:
            return False

    def __repr__(self) -> str:
        return f"<Admin {self.username}>"
