# ImageVault 部署指南（PythonAnywhere）

## 前置条件

1. 注册 PythonAnywhere 账号：https://www.pythonanywhere.com
2. 建议使用付费计划（支持 MySQL）

## 部署步骤

### 1. 上传代码

**方法 A：使用 Git（推荐）**

```bash
# 在 PythonAnywhere Bash 终端中
cd ~
git clone https://你的仓库地址.git image-vault
cd image-vault
```

**方法 B：手动上传**

1. 将 `server/` 和 `client/dist/` 打包为 zip
2. 在 PythonAnywhere 的 Files 页面上传
3. 解压到 `/home/你的用户名/image-vault/`

### 2. 创建数据库

1. 进入 PythonAnywhere 的 **Databases** 页面
2. 创建 MySQL 数据库：
   - 数据库名：`你的用户名$image_vault`
   - 设置数据库密码
3. 记下连接信息：
   - 主机：`你的用户名.mysql.pythonanywhere-services.com`
   - 用户名：`你的用户名`
   - 数据库：`你的用户名$image_vault`

### 3. 初始化数据库

在 PythonAnywhere Bash 终端中：

```bash
cd ~/image-vault/server

# 创建虚拟环境
mkvirtualenv imagevault --python=/usr/bin/python3.10

# 安装依赖
pip install -r requirements.txt
pip install pymysql

# 设置环境变量
export DB_HOST=你的用户名.mysql.pythonanywhere-services.com
export DB_USER=你的用户名
export DB_PASSWORD=你的数据库密码
export DB_NAME=你的用户名\$image_vault

# 初始化数据库
python setup_database.py

# 创建管理员
python init_admin.py -u admin -p 你的管理员密码
```

### 4. 配置 Web 应用

1. 进入 **Web** 页面
2. 点击 **Add a new web app**
3. 选择 **Manual configuration**
4. 选择 **Python 3.10**

### 5. 配置 WSGI 文件

点击 WSGI 配置文件链接，替换内容为：

```python
import sys
import os

# 添加项目路径
project_home = '/home/你的用户名/image-vault/server'
if project_home not in sys.path:
    sys.path.insert(0, project_home)

# 设置环境变量
os.environ['FLASK_ENV'] = 'production'
os.environ['SECRET_KEY'] = '你的SECRET_KEY'
os.environ['JWT_SECRET_KEY'] = '你的JWT_SECRET_KEY'
os.environ['DB_HOST'] = '你的用户名.mysql.pythonanywhere-services.com'
os.environ['DB_USER'] = '你的用户名'
os.environ['DB_PASSWORD'] = '你的数据库密码'
os.environ['DATABASE_URI'] = 'mysql+pymysql://你的用户名:你的数据库密码@你的用户名.mysql.pythonanywhere-services.com/你的用户名$image_vault'
os.environ['CORS_ORIGINS'] = 'https://你的用户名.pythonanywhere.com'

# 导入 Flask 应用
from app import create_app
application = create_app('production')
```

### 6. 配置静态文件

在 **Web** 页面的 **Static files** 部分添加：

| URL | Directory |
|-----|-----------|
| `/assets/` | `/home/你的用户名/image-vault/client/dist/assets/` |
| `/favicon.ico` | `/home/你的用户名/image-vault/client/dist/favicon.ico` |

### 7. 配置虚拟环境

在 **Web** 页面的 **Virtualenv` 部分输入：

```
/home/你的用户名/.virtualenvs/imagevault
```

### 8. 创建 .env 文件

```bash
cd ~/image-vault/server
cat > .env << 'EOF'
FLASK_ENV=production
SECRET_KEY=你的随机SECRET_KEY
JWT_SECRET_KEY=你的随机JWT_SECRET_KEY
DB_HOST=你的用户名.mysql.pythonanywhere-services.com
DB_USER=你的用户名
DB_PASSWORD=你的数据库密码
DATABASE_URI=mysql+pymysql://你的用户名:你的数据库密码@你的用户名.mysql.pythonanywhere-services.com/你的用户名$image_vault
CORS_ORIGINS=https://你的用户名.pythonanywhere.com
RATELIMIT_DEFAULT=200 per hour
MAX_CONTENT_LENGTH=52428800
EOF
```

### 9. 修改 app.py 静态文件路径

由于 PythonAnywhere 的静态文件由其自己的服务器处理，需要修改 `app.py`：

```python
# 在 app.py 中添加 PythonAnywhere 特殊处理
import platform

if 'pythonanywhere' in platform.node():
    # PythonAnywhere 环境，不服务静态文件
    FRONTEND_DIST = None
else:
    # 本地环境，服务静态文件
    FRONTEND_DIST = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'client', 'dist')
```

### 10. 重启 Web 应用

点击 **Web** 页面的 **Reload** 按钮。

## 访问应用

访问：`https://你的用户名.pythonanywhere.com`

## 常见问题

### Q: 静态文件（CSS/JS）加载失败？

检查 Static files 配置是否正确，路径末尾不要加 `/`。

### Q: API 返回 404？

检查 WSGI 配置文件中的路径是否正确。

### Q: 数据库连接失败？

1. 确认数据库主机名正确
2. 确认密码正确
3. 在 PythonAnywhere 的 MySQL 页面检查数据库是否存在

### Q: 如何更新代码？

```bash
cd ~/image-vault
git pull  # 如果使用 Git
# 或者重新上传文件

# 重启 Web 应用
# 在 Web 页面点击 Reload
```

### Q: 如何查看错误日志？

在 **Web** 页面底部有 Error log 和 Server log 链接。

## 文件结构（PythonAnywhere）

```
/home/你的用户名/
└── image-vault/
    ├── client/
    │   └── dist/          # 前端打包产物
    │       ├── index.html
    │       └── assets/
    └── server/
        ├── app.py
        ├── .env
        ├── requirements.txt
        └── ...
```

## 注意事项

1. PythonAnywhere 免费计划有限制：
   - 不能使用自定义域名
   - CPU 和内存有限
   - 每月有流量限制

2. 建议使用付费计划获得：
   - 自定义域名
   - 更多资源
   - 更好的性能

3. 定期备份数据库：
   ```bash
   # 在 PythonAnywhere Bash 中
   mysqldump -u 你的用户名 -p 你的用户名\$image_vault > backup.sql
   ```
