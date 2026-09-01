# ImageVault 快速启动指南

## 项目结构

```
E:/xx/js/
├── server/                    # Flask 后端
│   ├── app.py                # 应用工厂
│   ├── config.py             # 配置文件
│   ├── requirements.txt      # Python 依赖
│   ├── init_admin.py         # 管理员初始化脚本
│   ├── init_database.sql     # 数据库初始化 SQL
│   ├── models/               # 数据库模型
│   │   ├── __init__.py
│   │   ├── admin.py
│   │   └── image.py
│   ├── routes/               # API 路由
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   └── images.py
│   └── middleware/           # 中间件
│       └── __init__.py
│
├── client/                   # React 前端
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── src/
│       ├── App.jsx           # 路由配置
│       ├── main.jsx          # 入口文件
│       ├── api/              # API 调用
│       ├── components/       # 组件
│       ├── context/          # Context 状态管理
│       ├── hooks/            # 自定义 Hook
│       ├── pages/            # 页面组件
│       ├── styles/           # 样式文件
│       └── utils/            # 工具函数
│
└── image-vault/              # 部署配置
    ├── docker-compose.yml
    ├── nginx/nginx.conf
    └── server/Dockerfile
```

## 快速启动（开发模式）

### 1. 配置 MySQL 数据库

```sql
-- 登录 MySQL
mysql -u root -p

-- 执行初始化脚本
source E:/xx/js/server/init_database.sql
```

### 2. 启动后端

```bash
cd E:/xx/js/server

# 创建虚拟环境
python -m venv venv

# 激活虚拟环境（Windows）
venv\Scripts\activate

# 激活虚拟环境（Linux/Mac）
source venv/bin/activate

# 安装依赖
pip install -r requirements.txt

# 创建 .env 文件
cp ../image-vault/client/.env.example .env
# 编辑 .env 文件，配置数据库连接等

# 初始化管理员账号
python init_admin.py -u admin -p your_secure_password

# 启动 Flask 开发服务器
python app.py
```

后端将在 http://localhost:5000 启动

### 3. 启动前端

```bash
cd E:/xx/js/client

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

前端将在 http://localhost:5173 启动

## 使用流程

1. **访问应用**：打开 http://localhost:5173
2. **登录**：使用管理员账号登录
3. **设置加密口令**：输入加密口令（用于派生 AES 密钥）
4. **上传图片**：进入上传页面，选择图片上传
5. **查看图片**：进入画廊页面，点击图片查看

## 功能特性

### ✅ 已实现功能

- **管理员登录**：唯一管理员账号，JWT 认证
- **加密口令**：PBKDF2 派生 AES 密钥，存储在 sessionStorage
- **图片上传**：前端 AES-256-CBC 加密，后端存储密文
- **图片画廊**：分页显示图片列表
- **图片查看器**：
  - 放大/缩小
  - 旋转
  - 水平/垂直翻转
  - 全屏模式
  - 幻灯片模式
  - 键盘快捷键（← → +/- R F S ESC）
- **批量操作**：批量选择、批量删除
- **响应式设计**：支持移动端

## 安全架构

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

## 环境变量

### 后端 (.env)

```env
SECRET_KEY=your-secret-key-min-32-chars
SQLALCHEMY_DATABASE_URI=mysql+pymysql://root:password@localhost:3306/image_vault
JWT_SECRET_KEY=your-jwt-secret-min-32-chars
JWT_ACCESS_TOKEN_EXPIRES=3600
CORS_ORIGINS=http://localhost:5173
```

### 前端 (.env)

```env
VITE_API_BASE_URL=http://localhost:5000
```

## 常见问题

### Q: 忘记加密口令怎么办？
A: 加密口令用于派生 AES 密钥，如果忘记，已加密的图片将无法解密。请妥善保管口令。

### Q: 如何修改管理员密码？
A: 重新运行 `python init_admin.py -u admin -p new_password --reset`

### Q: 图片大小限制是多少？
A: 默认最大 50MB，可在配置中修改。

### Q: 支持哪些图片格式？
A: JPEG, PNG, GIF, WebP, BMP

## 部署到生产环境

参考 `image-vault/docker-compose.yml` 和 `nginx/nginx.conf` 配置生产环境。

主要步骤：
1. 配置 SSL 证书
2. 修改环境变量
3. 使用 Docker Compose 启动
4. 配置域名和反向代理

## 技术支持

如有问题，请检查：
1. MySQL 服务是否启动
2. 数据库连接配置是否正确
3. 管理员账号是否已初始化
4. 前后端端口是否冲突
