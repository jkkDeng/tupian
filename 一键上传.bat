@echo off
echo 🚀 自动生成所有主题...
node build.js
node music-build.js
node build.js huoying
node music-build.js huoying
git add .
git commit -m "更新"
git push
echo ✅ 完成
pause