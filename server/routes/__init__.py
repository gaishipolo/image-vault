"""路由模块 -- 注册所有 API 蓝图。"""

from routes.auth import auth_bp
from routes.images import images_bp

__all__ = ["auth_bp", "images_bp"]
