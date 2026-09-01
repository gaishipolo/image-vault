"""认证 API 路由 -- 管理员登录、Token 刷新与验证。"""

from flask import Blueprint, jsonify, request
from flask_jwt_extended import (
    create_access_token,
    get_jwt_identity,
    jwt_required,
)

from models import Admin, db

auth_bp = Blueprint("auth", __name__)


# ---------------------------------------------------------------------------
# 辅助函数
# ---------------------------------------------------------------------------

def _success(data=None, status: int = 200):
    """构造成功响应。"""
    return jsonify({"success": True, "data": data}), status


def _error(code: str, message: str, status: int = 400):
    """构造错误响应。"""
    return jsonify({"success": False, "error": {"code": code, "message": message}}), status


# ---------------------------------------------------------------------------
# POST /api/auth/login -- 管理员登录
# ---------------------------------------------------------------------------

@auth_bp.route("/login", methods=["POST"])
def login():
    """管理员登录，验证凭据后返回 JWT access_token。

    请求体 (JSON):
        username: str -- 用户名
        password: str -- 密码
    """
    data = request.get_json(silent=True)
    if not data:
        return _error("INVALID_REQUEST", "请求体必须为 JSON 格式", 400)

    username: str | None = data.get("username")
    password: str | None = data.get("password")

    if not username or not password:
        return _error("MISSING_FIELDS", "用户名和密码不能为空", 400)

    # 查找管理员
    admin: Admin | None = Admin.query.filter_by(username=username).first()
    if admin is None or not admin.check_password(password):
        return _error("INVALID_CREDENTIALS", "用户名或密码错误", 401)

    # 生成 JWT，identity 使用管理员 id（字符串形式）
    access_token: str = create_access_token(identity=str(admin.id))
    return _success({"access_token": access_token})


# ---------------------------------------------------------------------------
# POST /api/auth/refresh -- 刷新 Token
# ---------------------------------------------------------------------------

@auth_bp.route("/refresh", methods=["POST"])
@jwt_required()
def refresh():
    """使用当前有效 token 换取新的 access_token。"""
    current_user_id: str = get_jwt_identity()
    new_token: str = create_access_token(identity=current_user_id)
    return _success({"access_token": new_token})


# ---------------------------------------------------------------------------
# GET /api/auth/verify -- 验证 Token 有效性
# ---------------------------------------------------------------------------

@auth_bp.route("/verify", methods=["GET"])
@jwt_required()
def verify():
    """验证当前 token 是否有效，并返回管理员信息。"""
    current_user_id: str = get_jwt_identity()
    admin: Admin | None = db.session.get(Admin, int(current_user_id))

    if admin is None:
        return _error("USER_NOT_FOUND", "管理员账户不存在", 404)

    return _success({
        "id": admin.id,
        "username": admin.username,
        "created_at": admin.created_at.isoformat(),
    })
