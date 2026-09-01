"""SQLAlchemy database instance and model imports."""

from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

# Re-export models so callers can do `from models import Admin, Image`
from models.admin import Admin  # noqa: E402, F401
from models.image import Image  # noqa: E402, F401

__all__ = ["db", "Admin", "Image"]
