# 🔐 ImageVault - 高私密性图片管理系统

一个高私密性的图片管理系统，图片在前端加密后上传，后端只存储加密密文。

## ✨ 核心特性

- **前端加密**：使用 AES-256-CBC 加密，密钥永不离开浏览器
- **唯一管理员**：系统只允许一个管理员账号
- **图片浏览器**：支持放大/缩小、旋转、翻转、全屏、幻灯片模式
- **安全存储**：MySQL BLOB 存储加密密文
- **JWT 认证**：无状态认证，支持 token 刷新

## 🏗️ 技术栈

| 组件 | 技术 |
|------|------|
| 后端 | Python Flask 3.x |
| 前端 | React 19 + Vite |
| 数据库 | MySQL 8.x |
| 加密 | CryptoJS (AES-256-CBC) |
| 认证 | JWT (flask-jwt-extended) |
| 密码哈希 | Argon2id |

## 📁 项目结构

```
image-vault/
├── server/                 # Flask 后端
│   ├── app.py             # 应用工厂
│   ├── config.py          # 配置文件
│   ├── requirements.txt   # Python 依赖
│   ├── init_admin.py      # 管理员初始化脚本
│   ├── models/            # 数据库模型
│   └── routes/            # API 路由
│
├── client/                # React 前端
│   ├── src/
│   │   ├── api/           # API 调用
│   │   ├── components/    # React 组件
│   │   ├── context/       # Context 状态管理
│   │   ├── pages/         # 页面组件
│   │   └── utils/         # 工具函数（加密等）
│   └── package.json
│
└── README.md
```

## 🚀 快速开始

### 前置要求

- Python 3.10+
- Node.js 18+
- MySQL 8.x

### 1. 克隆项目

```bash
cd E:/xx/js
```

### 2. 设置后端

```bash
cd server

# 创建虚拟环境
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 安装依赖
pip install -r requirements.txt

# 配置环境变量
cp .env.example .env
# 编辑 .env 文件，设置数据库连接等

# 初始化数据库
python -c "from app import create_app; from models import db; app = create_app(); app.app_context().push(); db.create_all()"

# 创建管理员账号
python init_admin.py
```

### 3. 设置前端

```bash
cd client

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env
# 编辑 .env 文件，设置 API 地址

# 启动开发服务器
npm run dev
```

### 4. 访问应用

- 前端：http://localhost:5173
- 后端 API：http://localhost:5000

## 🔐 安全架构

### 加密流程

```
管理员口令
    │
    ▼ (PBKDF2 + Salt)
主密钥 (Master Key)
    │
    ▼ (AES 加密)
每张图片的 AES 密钥
    │
    ▼ (AES-256-CBC)
加密的图片数据
```

### 安全措施

| 威胁 | 防护措施 |
|------|----------|
| CSRF | JWT 在 Authorization 头中 |
| XSS | React 默认转义 + CSP |
| 暴力破解 | 速率限制 5次/分钟 |
| 数据泄露 | AES-256 加密，无口令无法解密 |
| 中间人 | 强制 HTTPS |
| SQL 注入 | SQLAlchemy ORM |

## 📖 API 文档

### 认证

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/auth/login` | 管理员登录 |
| POST | `/api/auth/refresh` | 刷新 token |

### 图片

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/images` | 获取图片列表 |
| GET | `/api/images/<id>` | 获取单张图片 |
| POST | `/api/images/upload` | 上传加密图片 |
| PUT | `/api/images/<id>` | 更新元数据 |
| DELETE | `/api/images/<id>` | 删除图片 |

## ⌨️ 快捷键

| 快捷键 | 功能 |
|--------|------|
| `←` / `→` | 切换图片 |
| `+` / `-` | 放大/缩小 |
| `R` | 旋转 |
| `F` | 全屏 |
| `S` | 幻灯片模式 |
| `ESC` | 关闭查看器 |

## 📝 环境变量

### 后端 (.env)

```env
SECRET_KEY=your-secret-key-here
SQLALCHEMY_DATABASE_URI=mysql+pymysql://user:password@localhost/image_vault
JWT_SECRET_KEY=your-jwt-secret-here
CORS_ORIGINS=http://localhost:5173
```

### 前端 (.env)

```env
VITE_API_BASE_URL=http://localhost:5000
```

## 📄 许可证

MIT License
