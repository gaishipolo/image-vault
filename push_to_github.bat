@echo off
REM ImageVault GitHub 上传脚本
REM 使用前请修改下面的用户名和邮箱

REM ===== 请修改这两行 =====
set GIT_USERNAME=gaishipolo
set GIT_EMAIL=2796237197@qq.com
REM =========================

REM 配置 Git
git config user.name "%GIT_USERNAME%"
git config user.email "%GIT_EMAIL%"

REM 添加所有文件
git add .

REM 提交
git commit -m "feat: 初始化ImageVault"

REM 添加远程仓库
git remote add origin https://github.com/%GIT_USERNAME%/image-vault.git 2>nul

REM 推送到 GitHub
git push -u origin master

echo.
echo ✅ 上传完成！
echo 访问：https://github.com/%GIT_USERNAME%/image-vault
pause
