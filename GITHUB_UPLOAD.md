# GitHub 上传步骤

## 方法 1：使用脚本（推荐）

编辑 `push_to_github.bat`，修改前两行：
```
set GIT_USERNAME=你的GitHub用户名
set GIT_EMAIL=你的邮箱@example.com
```

然后双击运行 `push_to_github.bat`

## 方法 2：手动执行命令

```bash
# 1. 配置 Git（替换为你的信息）
git config user.name "你的GitHub用户名"
git config user.email "你的邮箱@example.com"

# 2. 添加远程仓库（先在 GitHub 创建仓库）
git remote add origin https://github.com/你的用户名/image-vault.git

# 3. 推送
git push -u origin master
```

## 方法 3：使用 GitHub CLI

```bash
# 安装 GitHub CLI 后
gh repo create image-vault --public --source=. --push
```

## 注意事项

1. **先在 GitHub 创建仓库**：
   - 访问 https://github.com/new
   - 仓库名：`image-vault`
   - 选择 Public 或 Private
   - **不要**勾选 README、.gitignore、License

2. **如果推送失败**：
   - 检查用户名和邮箱是否正确
   - 检查是否有权限
   - 尝试使用 SSH 或 Personal Access Token

3. **使用 Personal Access Token**：
   - 访问 https://github.com/settings/tokens
   - 生成新 token，勾选 `repo` 权限
   - 推送时使用 token 作为密码

## 当前 Git 状态

✅ Git 已初始化
✅ .gitignore 已配置
✅ 文件已暂存
⏳ 等待配置用户信息和推送
