@echo off
chcp 65001 >nul
echo ========================================
echo  推送到 GitHub Pages (ETH 仓库)
echo ========================================
echo.

cd /d "%~dp0"

:: 设置提交信息
set COMMIT_MSG=Deploy: klakna exchange frontend (Vue.js SPA)

:: 拉取远程内容（如果远程有内容先拉）
echo [1/4] 拉取远程仓库...
git fetch origin main 2>nul
git fetch origin master 2>nul

:: 强制覆盖 - 设置分支并重置
echo [2/4] 准备提交...
git checkout -B main
git add -A
git commit -m "%COMMIT_MSG%"

:: 推送（强制覆盖远程）
echo [3/4] 推送到 GitHub...
echo.
echo 请输入 GitHub 用户名: cptmarketscoin-ctrl
echo 密码处请输入 Personal Access Token (PAT)
echo.
git push origin main --force

echo.
echo [4/4] 完成！
echo.
echo 访问以下地址查看效果：
echo https://cptmarketscoin-ctrl.github.io/ETH/
echo.
echo 如果 GitHub Pages 未开启，请到以下地址设置：
echo https://github.com/cptmarketscoin-ctrl/ETH/settings/pages
echo 选择: Branch = main, Folder = / (root)
echo.
pause
