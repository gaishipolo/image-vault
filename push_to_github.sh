#!/bin/bash
# ImageVault GitHub 上传脚本
# 使用前请修改下面的用户名和邮箱

# ===== 请修改这两行 =====
GIT_USERNAME="你的GitHub用户名"
GIT_EMAIL="你的邮箱@example.com"
# =========================

# 配置 Git
git config user.name "$GIT_USERNAME"
git config user.email "$GIT_EMAIL"

# 添加所有文件
git add .

# 提交
git commit -m "feat: 初始化 ImageVault 高私密性图片管理系统

- 前端：React 19 + Vite，支持 AES-256-CBC 加密
- 后端：Python Flask，MySQL BLOB 存储加密密文
- 安全：JWT 认证、Argon2id 密码哈希、速率限制
- 功能：图片上传/查看/删除、加密缩略图、搜索
- 体验：移动端适配、手势操作、Toast 通知
- 部署：支持本地部署和 PythonAnywhere"

# 添加远程仓库（如果还没有）
git remote add origin https://github.com/$GIT_USERNAME/image-vault.git 2>/dev/null || true

# 推送到 GitHub
git push -u origin master

echo ""
echo "✅ 上传完成！"
echo "访问：https://github.com/$GIT_USERNAME/image-vault"
