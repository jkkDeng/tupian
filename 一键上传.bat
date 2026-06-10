@echo off
echo 🚀 正在自动扫描 所有主题 图片 + 音乐...
node build-all.js

echo.
git add .
git commit -m "自动更新资源"
git push

echo.
echo ✅ 上传完成！
pause