# 🔐 ImageVault - 高私密性图片管理系统

一个高私密性的图片管理系统，图片在前端加密后上传，后端只存储加密密文。

## ✨ 核心特性

- **前端加密**：使用 AES-256-CBC 加密，密钥永不离开浏览器
- **唯一管理员**：系统只允许一个管理员账号
- **图片浏览器**：支持放大/缩小、旋转、翻转、全屏、幻灯片模式、手势操作
- **安全存储**：MySQL BLOB 存储加密密文
- **JWT 认证**：无状态认证，支持 token 刷新
- **移动端适配**：底部 Tab Bar、触摸手势、响应式设计

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
├── server/                    # Flask 后端
│   ├── app.py                # 应用工厂
│   ├── config.py             # 配置文件
│   ├── requirements.txt      # Python 依赖
│   ├── init_admin.py         # 管理员初始化
│   ├── setup_database.py     # 数据库初始化
│   ├── models/               # 数据库模型
│   ├── routes/               # API 路由
│   └── middleware/           # 中间件
│
├── client/                   # React 前端
│   ├── src/
│   │   ├── api/              # API 调用
│   │   ├── components/       # React 组件
│   │   ├── context/          # Context 状态管理
│   │   ├── hooks/            # 自定义 Hook
│   │   ├── pages/            # 页面组件
│   │   ├── styles/           # 样式文件
│   │   └── utils/            # 工具函数（加密等）
│   └── package.json
│
├── DEPLOY.md                 # 部署指南
├── PYTHONANYWHERE.md         # PythonAnywhere 部署指南
└── README.md                 # 本文件
```

## 🚀 快速开始

### 前置要求

- Python 3.10+
- Node.js 18+
- MySQL 8.x

### 1. 克隆项目

```bash
git clone https://github.com/你的用户名/image-vault.git
cd image-vault
```

### 2. 配置后端

```bash
cd server

# 创建虚拟环境
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 安装依赖
pip install -r requirements.txt

# 配置环境变量
cp .env.example .env
# 编辑 .env 文件，配置数据库连接等

# 初始化数据库
python setup_database.py

# 创建管理员账号
python init_admin.py -u admin -p your_secure_password

# 启动后端
python app.py
```

### 3. 配置前端

```bash
cd client

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

### 4. 访问应用

- 前端：http://localhost:3000
- 后端 API：http://localhost:5000

## 🔐 安全架构

```
管理员口令
    │
    ▼ (PBKDF2 + Salt)
主密钥 (Master Key)
    │
    ▼ (AES-256-CBC)
每张图片的 AES 密钥
    │
    ▼ (AES-256-CBC)
加密的图片数据
```

**关键安全特性**：
- 密钥永不离开浏览器
- 后端只存储加密密文
- 每张图片使用独立随机 IV
- JWT 认证，无状态会话
- 速率限制防暴力破解

## 📖 API 文档

### 认证

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/auth/login` | 管理员登录 |
| POST | `/api/auth/refresh` | 刷新 token |
| GET | `/api/auth/verify` | 验证 token |

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

## 📱 移动端支持

- 底部 Tab Bar 导航
- 左右滑动切换图片
- 触摸友好的按钮尺寸
- 响应式布局

## 🚀 部署

### 本地部署

参考 [DEPLOY.md](DEPLOY.md)

### PythonAnywhere 部署

参考 [PYTHONANYWHERE.md](PYTHONANYWHERE.md)

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📧 联系方式

如有问题，请提交 Issue。
