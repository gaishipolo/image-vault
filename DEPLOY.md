# ImageVault 部署指南（无 Docker）

## 前置要求

- Python 3.12+（conda py312 环境）
- MySQL 8.x
- Node.js 18+（仅打包时需要）

## 部署步骤

### 1. 打包前端（已完成）

```bash
cd E:/xx/js/client
npm run build
```

打包产物在 `client/dist/` 目录。

### 2. 安装 Python 依赖

```bash
cd E:/xx/js/server
C:/Users/PC/.conda/envs/py312/python.exe -m pip install waitress
```

### 3. 配置生产环境

编辑 `server/.env.production`：

```env
# 必须修改的配置
SECRET_KEY=你的随机密钥1（至少32字符）
JWT_SECRET_KEY=你的随机密钥2（至少32字符）
DB_PASSWORD=你的数据库密码
CORS_ORIGINS=http://你的域名或IP
```

生成随机密钥：
```bash
C:/Users/PC/.conda/envs/py312/python.exe -c "import secrets; print(secrets.token_hex(32))"
```

### 4. 启动生产服务器

```bash
cd E:/xx/js/server

# 使用生产配置
copy .env.production .env

# 启动服务器
C:/Users/PC/.conda/envs/py312/python.exe start_production.py
```

服务器将在 `http://0.0.0.0:5000` 启动。

### 5. 访问应用

打开浏览器访问：`http://localhost:5000`

## 后台运行（Windows）

### 方法 1：使用 pythonw

```bash
# 后台运行（无命令行窗口）
C:/Users/PC/.conda/envs/py312/pythonw.exe start_production.py
```

停止：任务管理器 → 结束 pythonw.exe 进程

### 方法 2：注册为 Windows 服务

使用 NSSM（Non-Sucking Service Manager）：

```bash
# 下载 nssm: https://nssm.cc/download
nssm install ImageVault "C:\Users\PC\.conda\envs\py312\python.exe" "E:\xx\js\server\start_production.py"
nssm start ImageVault
```

## 目录结构

```
E:/xx/js/
├── client/
│   └── dist/          # 前端打包产物
├── server/
│   ├── app.py         # Flask 应用（已配置服务静态文件）
│   ├── start_production.py  # 生产环境启动脚本
│   ├── .env           # 当前配置
│   └── .env.production # 生产环境配置模板
└── DEPLOY.md          # 本文件
```

## 常见问题

### Q: 如何修改端口？

编辑 `.env` 文件：
```env
PORT=8080
```

### Q: 如何查看日志？

启动时会输出到控制台。如需保存日志：
```bash
C:/Users/PC/.conda/envs/py312/python.exe start_production.py > app.log 2>&1
```

### Q: 如何停止服务？

- 命令行运行：按 `Ctrl+C`
- pythonw 运行：任务管理器结束进程
- Windows 服务：`nssm stop ImageVault`

### Q: 前端更新后如何部署？

```bash
# 1. 重新打包前端
cd E:/xx/js/client
npm run build

# 2. 重启后端服务
cd E:/xx/js/server
# 停止旧服务，然后重新启动
C:/Users/PC/.conda/envs/py312/python.exe start_production.py
```

## 安全建议

1. **必须修改默认密钥**：`.env` 中的 `SECRET_KEY` 和 `JWT_SECRET_KEY`
2. **使用强密码**：数据库密码和管理员密码
3. **限制访问**：生产环境建议使用 Nginx 反向代理
4. **启用 HTTPS**：使用 Let's Encrypt 或其他 SSL 证书
5. **定期备份**：备份 MySQL 数据库
