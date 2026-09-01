# API 设计文档

## 认证 API

### POST /api/auth/login
管理员登录
**请求体:**
```json
{
  "username": "admin",
  "password": "password123"
}
```
**响应:**
```json
{
  "success": true,
  "token": "jwt_token_here",
  "expires_in": 3600
}
```

### POST /api/auth/logout
管理员登出（需要 JWT）
**请求头:** Authorization: Bearer <token>
**响应:**
```json
{
  "success": true,
  "message": "已登出"
}
```

### GET /api/auth/verify
验证 token 有效性（需要 JWT）
**响应:**
```json
{
  "valid": true,
  "username": "admin"
}
```

---

## 图片 API

### POST /api/images/upload
上传加密图片（需要 JWT）
**请求头:** Authorization: Bearer <token>
**请求体:** multipart/form-data
- encrypted_data: 加密后的图片数据（二进制）
- metadata: JSON 字符串
```json
{
  "filename": "photo.jpg",
  "mime_type": "image/jpeg",
  "file_size": 1024000,
  "encrypted_key": "encrypted_aes_key_base64",
  "iv": "iv_base64",
  "width": 1920,
  "height": 1080
}
```
**响应:**
```json
{
  "success": true,
  "image_id": 1,
  "message": "图片上传成功"
}
```

### GET /api/images
获取图片列表（需要 JWT）
**查询参数:**
- page: 页码（默认 1）
- limit: 每页数量（默认 20）
- sort: 排序字段（created_at, filename）
- order: 排序方向（asc, desc）
**响应:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "filename": "photo.jpg",
      "mime_type": "image/jpeg",
      "file_size": 1024000,
      "width": 1920,
      "height": 1080,
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  }
}
```

### GET /api/images/:id
获取单个图片加密数据（需要 JWT）
**响应:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "filename": "photo.jpg",
    "mime_type": "image/jpeg",
    "encrypted_data": "base64_encoded_encrypted_data",
    "encrypted_key": "base64_encoded_encrypted_key",
    "iv": "base64_encoded_iv",
    "width": 1920,
    "height": 1080
  }
}
```

### GET /api/images/:id/thumbnail
获取缩略图（需要 JWT）
**响应:** 加密的缩略图二进制数据

### DELETE /api/images/:id
删除图片（需要 JWT）
**响应:**
```json
{
  "success": true,
  "message": "图片已删除"
}
```

### POST /api/images/batch-delete
批量删除图片（需要 JWT）
**请求体:**
```json
{
  "ids": [1, 2, 3]
}
```
**响应:**
```json
{
  "success": true,
  "deleted_count": 3
}
```

---

## 管理员 API

### GET /api/admin/profile
获取管理员信息（需要 JWT）
**响应:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "username": "admin",
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

### PUT /api/admin/password
修改密码（需要 JWT）
**请求体:**
```json
{
  "current_password": "old_password",
  "new_password": "new_password"
}
```
**响应:**
```json
{
  "success": true,
  "message": "密码已更新"
}
```

---

## 错误响应格式
所有 API 错误响应遵循以下格式：
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "未授权访问"
  }
}
```

**错误码:**
- 400: BAD_REQUEST - 请求参数错误
- 401: UNAUTHORIZED - 未认证或 token 无效
- 403: FORBIDDEN - 无权限
- 404: NOT_FOUND - 资源不存在
- 500: INTERNAL_ERROR - 服务器内部错误
