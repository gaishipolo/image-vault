"""Flask application factory for the Image Vault backend."""

import os
import platform

from flask import Flask, send_from_directory
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

from config import config_by_name
from models import db

# 全局 limiter 实例，在 create_app 中初始化，供蓝图导入使用
limiter: Limiter | None = None

# 判断是否在 PythonAnywhere 环境
IS_PYTHONANYWHERE = 'pythonanywhere' in platform.node()

# 前端静态文件目录（相对于 server 目录）
if IS_PYTHONANYWHERE:
    # PythonAnywhere 环境，静态文件由平台处理
    FRONTEND_DIST = None
else:
    # 本地环境，Flask 服务静态文件
    FRONTEND_DIST = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'client', 'dist')


def create_app(config_name: str | None = None) -> Flask:
    """Create and configure the Flask application.

    Parameters
    ----------
    config_name:
        One of ``"development"`` / ``"production"``.
        Defaults to the ``FLASK_ENV`` environment variable (development).
    """
    config_name = config_name or os.getenv("FLASK_ENV", "development")

    if FRONTEND_DIST:
        app = Flask(__name__, static_folder=FRONTEND_DIST, static_url_path='')
    else:
        app = Flask(__name__)
    app.config.from_object(config_by_name[config_name])

    # --- Extensions --------------------------------------------------------
    db.init_app(app)

    CORS(app, origins=app.config["CORS_ORIGINS"].split(","))

    JWTManager(app)

    global limiter
    limiter = Limiter(
        app=app,
        key_func=get_remote_address,
        default_limits=[app.config["RATELIMIT_DEFAULT"]],
        storage_uri=app.config["RATELIMIT_STORAGE_URI"],
    )

    # --- Health-check route ------------------------------------------------
    @app.route("/api/health", methods=["GET"])
    def health():
        return {"status": "ok"}, 200

    # --- Register blueprints -------------------------------------------------
    from routes.auth import auth_bp
    from routes.images import images_bp

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(images_bp, url_prefix="/api/images")

    # 为登录路由添加专用限流：每分钟最多 5 次
    limiter.limit("5/minute", error_message="登录尝试过于频繁，请稍后再试")(
        app.view_functions["auth.login"]
    )

    # --- 前端静态文件服务 ---------------------------------------------------
    if FRONTEND_DIST:
        @app.route('/', defaults={'path': ''})
        @app.route('/<path:path>')
        def serve_frontend(path):
            """服务前端静态文件，非 API 路由都返回 index.html"""
            if path and os.path.exists(os.path.join(FRONTEND_DIST, path)):
                return send_from_directory(FRONTEND_DIST, path)
            return send_from_directory(FRONTEND_DIST, 'index.html')

    return app


# Allow running directly for development
if __name__ == "__main__":
    app = create_app()
    app.run(host="0.0.0.0", port=5000, debug=True)
