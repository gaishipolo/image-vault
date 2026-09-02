"""图片 CRUD API 路由 -- 加密图片的上传、查询、更新与删除。"""

import base64
import re

from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from models import Image, db

images_bp = Blueprint("images", __name__)

# 允许的 MIME 类型白名单
_ALLOWED_MIME_TYPES: set[str] = {
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/bmp",
}

# 最大文件大小：50 MB
_MAX_FILE_SIZE: int = 50 * 1024 * 1024

# 默认分页大小
_DEFAULT_PAGE: int = 1
_DEFAULT_LIMIT: int = 20
_MAX_LIMIT: int = 100

# 允许的排序字段
_ALLOWED_SORT_FIELDS: set[str] = {
    "id",
    "original_filename",
    "file_size",
    "mime_type",
    "created_at",
    "updated_at",
}


# ---------------------------------------------------------------------------
# 辅助函数
# ---------------------------------------------------------------------------

def _success(data=None, status: int = 200):
    """构造成功响应。"""
    return jsonify({"success": True, "data": data}), status


def _error(code: str, message: str, status: int = 400):
    """构造错误响应。"""
    return jsonify({"success": False, "error": {"code": code, "message": message}}), status


def _image_to_dict(image: Image, *, include_data: bool = False, include_thumbnail: bool = False) -> dict:
    """将 Image ORM 对象转为字典。

    Parameters
    ----------
    image:
        Image 模型实例。
    include_data:
        是否包含 encrypted_data 字段（二进制数据以 base64 编码）。
    include_thumbnail:
        是否包含 encrypted_thumbnail 字段。
    """
    result: dict = {
        "id": image.id,
        "original_filename": image.original_filename,
        "mime_type": image.mime_type,
        "file_size": image.file_size,
        "iv": image.iv,
        "has_thumbnail": image.encrypted_thumbnail is not None,
        "description": image.description,
        "tags": image.tags,
        "created_at": image.created_at.isoformat(),
        "updated_at": image.updated_at.isoformat(),
    }
    if include_data:
        # encrypted_data 为 LargeBinary，转为 base64 字符串便于 JSON 传输
        result["encrypted_data"] = base64.b64encode(image.encrypted_data).decode("ascii")
    if include_thumbnail and image.encrypted_thumbnail:
        result["encrypted_thumbnail"] = base64.b64encode(image.encrypted_thumbnail).decode("ascii")
        result["thumbnail_iv"] = image.thumbnail_iv
    return result


# ---------------------------------------------------------------------------
# GET /api/images -- 获取图片列表（分页，不含加密数据）
# ---------------------------------------------------------------------------

@images_bp.route("", methods=["GET"])
@jwt_required()
def list_images():
    """分页查询图片列表，仅返回元数据。

    查询参数:
        page:  int -- 页码（默认 1）
        limit: int -- 每页条数（默认 20，最大 100）
        sort:  str -- 排序字段（默认 created_at）
        order: str -- 排序方向 asc / desc（默认 desc）
    """
    # 解析分页参数
    try:
        page: int = max(1, int(request.args.get("page", _DEFAULT_PAGE)))
        limit: int = max(1, min(int(request.args.get("limit", _DEFAULT_LIMIT)), _MAX_LIMIT))
    except (ValueError, TypeError):
        return _error("INVALID_PARAMS", "page 和 limit 必须为正整数")

    sort_field: str = request.args.get("sort", "created_at")
    order: str = request.args.get("order", "desc").lower()

    # 校验排序字段
    if sort_field not in _ALLOWED_SORT_FIELDS:
        return _error("INVALID_SORT_FIELD", f"不支持的排序字段: {sort_field}")

    if order not in ("asc", "desc"):
        return _error("INVALID_ORDER", "order 只支持 asc 或 desc")

    # 搜索过滤
    search: str = request.args.get("search", "").strip()
    query = Image.query
    if search:
        # 转义 LIKE 通配符
        escaped_search = search.replace('\\', '\\\\').replace('%', '\\%').replace('_', '\\_')
        like_pattern = f"%{escaped_search}%"
        query = query.filter(
            db.or_(
                Image.original_filename.ilike(like_pattern),
                Image.description.ilike(like_pattern),
                Image.tags.ilike(like_pattern),
            )
        )

    # 构建查询
    sort_column = getattr(Image, sort_field)
    order_clause = sort_column.asc() if order == "asc" else sort_column.desc()

    pagination = query.order_by(order_clause).paginate(
        page=page, per_page=limit, error_out=False,
    )

    items: list[dict] = [_image_to_dict(img, include_thumbnail=True) for img in pagination.items]

    return _success({
        "items": items,
        "pagination": {
            "page": pagination.page,
            "limit": limit,
            "total": pagination.total,
            "pages": pagination.pages,
        },
    })


# ---------------------------------------------------------------------------
# GET /api/images/<id> -- 获取单张图片加密数据
# ---------------------------------------------------------------------------

@images_bp.route("/<int:image_id>", methods=["GET"])
@jwt_required()
def get_image(image_id: int):
    """获取单张图片的完整信息，包含加密数据。"""
    image: Image | None = db.session.get(Image, image_id)
    if image is None:
        return _error("NOT_FOUND", f"图片 {image_id} 不存在", 404)

    return _success(_image_to_dict(image, include_data=True))


# ---------------------------------------------------------------------------
# GET /api/images/<id>/meta -- 获取图片元数据（不含加密数据）
# ---------------------------------------------------------------------------

@images_bp.route("/<int:image_id>/meta", methods=["GET"])
@jwt_required()
def get_image_meta(image_id: int):
    """获取图片元数据，不含加密数据。"""
    image: Image | None = db.session.get(Image, image_id)
    if image is None:
        return _error("NOT_FOUND", f"图片 {image_id} 不存在", 404)

    return _success(_image_to_dict(image, include_data=False))


# ---------------------------------------------------------------------------
# POST /api/images/upload -- 上传加密图片
# ---------------------------------------------------------------------------

@images_bp.route("/upload", methods=["POST"])
@jwt_required()
def upload_image():
    """上传加密图片。

    请求体 (JSON):
        encrypted_data:     str -- base64 编码的加密图片数据
        iv:                 str -- AES 初始化向量
        original_filename:  str -- 原始文件名
        mime_type:          str -- MIME 类型
        file_size:          int -- 原始文件大小（字节）
        description:        str -- 图片描述（可选）
        tags:               str -- 标签，逗号分隔（可选）
    """
    data = request.get_json(silent=True)
    if not data:
        return _error("INVALID_REQUEST", "请求体必须为 JSON 格式", 400)

    # 必填字段校验
    required_fields = ["encrypted_data", "iv", "original_filename", "mime_type", "file_size"]
    missing = [f for f in required_fields if f not in data or data[f] is None]
    if missing:
        return _error("MISSING_FIELDS", f"缺少必填字段: {', '.join(missing)}", 400)

    # MIME 类型白名单校验
    mime_type: str = data["mime_type"]
    if mime_type not in _ALLOWED_MIME_TYPES:
        return _error(
            "INVALID_MIME_TYPE",
            f"不支持的文件类型: {mime_type}，允许: {', '.join(sorted(_ALLOWED_MIME_TYPES))}",
        )

    # 文件大小校验
    file_size: int = int(data["file_size"])
    if file_size <= 0 or file_size > _MAX_FILE_SIZE:
        return _error("INVALID_FILE_SIZE", f"文件大小必须在 1 ~ {_MAX_FILE_SIZE} 字节之间")

    # 文件名校验
    original_filename: str = data["original_filename"].strip()
    if not original_filename or len(original_filename) > 255:
        return _error("INVALID_FILENAME", "文件名无效或过长")
    # 移除路径分隔符和危险字符
    original_filename = re.sub(r'[/\\<>:"|?*\x00-\x1f]', '', original_filename)
    if not original_filename:
        return _error("INVALID_FILENAME", "文件名无效")

    # 解码 base64 加密数据
    try:
        encrypted_bytes: bytes = base64.b64decode(data["encrypted_data"])
    except Exception:
        return _error("INVALID_DATA", "encrypted_data 不是有效的 base64 编码")

    # 实际大小校验：防止 base64 膨胀后超出限制
    if len(encrypted_bytes) > _MAX_FILE_SIZE:
        return _error("INVALID_DATA", f"加密数据大小超过限制 ({_MAX_FILE_SIZE} 字节)")

    # 解码缩略图数据（如果有）
    encrypted_thumbnail_bytes = None
    thumbnail_iv_value = None
    if 'encrypted_thumbnail' in data and data['encrypted_thumbnail']:
        try:
            encrypted_thumbnail_bytes = base64.b64decode(data['encrypted_thumbnail'])
            thumbnail_iv_value = data.get('thumbnail_iv')
        except Exception:
            return _error("INVALID_DATA", "encrypted_thumbnail 不是有效的 base64 编码")

    # 创建记录
    image = Image(
        original_filename=original_filename,
        mime_type=mime_type,
        file_size=file_size,
        encrypted_data=encrypted_bytes,
        iv=data["iv"],
        encrypted_thumbnail=encrypted_thumbnail_bytes,
        thumbnail_iv=thumbnail_iv_value,
        description=data.get("description"),
        tags=data.get("tags"),
    )
    db.session.add(image)
    db.session.commit()

    return _success(_image_to_dict(image), status=201)


# ---------------------------------------------------------------------------
# PUT /api/images/<id> -- 更新图片元数据
# ---------------------------------------------------------------------------

@images_bp.route("/<int:image_id>", methods=["PUT"])
@jwt_required()
def update_image(image_id: int):
    """更新图片的 description 和 tags。

    请求体 (JSON):
        description: str -- 新描述（可选）
        tags:        str -- 新标签（可选）
    """
    image: Image | None = db.session.get(Image, image_id)
    if image is None:
        return _error("NOT_FOUND", f"图片 {image_id} 不存在", 404)

    data = request.get_json(silent=True)
    if not data:
        return _error("INVALID_REQUEST", "请求体必须为 JSON 格式", 400)

    # 只允许更新 description 和 tags
    if "description" in data:
        image.description = data["description"]
    if "tags" in data:
        image.tags = data["tags"]

    db.session.commit()
    return _success(_image_to_dict(image))


# ---------------------------------------------------------------------------
# PUT /api/images/batch -- 批量更新图片标签
# ---------------------------------------------------------------------------

@images_bp.route("/batch", methods=["PUT"])
@jwt_required()
def batch_update_tags():
    """批量更新图片标签。

    请求体 (JSON):
        ids:  list[int] -- 图片 ID 列表
        tags: str       -- 新标签
    """
    data = request.get_json(silent=True)
    if not data:
        return _error("INVALID_REQUEST", "请求体必须为 JSON 格式", 400)

    ids = data.get("ids", [])
    tags = data.get("tags", "")

    if not ids:
        return _error("MISSING_FIELDS", "缺少 ids 参数")
    if not tags:
        return _error("MISSING_FIELDS", "缺少 tags 参数")

    # 批量更新
    updated = Image.query.filter(Image.id.in_(ids)).update(
        {"tags": tags}, synchronize_session=False
    )
    db.session.commit()

    return _success({"updated": updated})


# ---------------------------------------------------------------------------
# DELETE /api/images/<id> -- 删除图片
# ---------------------------------------------------------------------------

@images_bp.route("/<int:image_id>", methods=["DELETE"])
@jwt_required()
def delete_image(image_id: int):
    """删除指定图片。"""
    image: Image | None = db.session.get(Image, image_id)
    if image is None:
        return _error("NOT_FOUND", f"图片 {image_id} 不存在", 404)

    db.session.delete(image)
    db.session.commit()

    return _success({"id": image_id, "deleted": True})
