@echo off
echo ==============================================
echo 🚀 自动扫描图片并上传到 GitHub
echo ==============================================
echo.

:: 自动扫描图片，生成 images.json
echo 正在扫描图片...
node build.js

echo.
echo ✅ 图片清单已更新

:: 自动提交
echo.
echo 正在提交...
git add .
git commit -m "更新图片 gallery"

:: 自动推送
echo.
echo 正在推送到 GitHub...
git push

echo.
echo ==============================================
echo ✅ 全部完成！网站已自动更新！
echo ==============================================
pause