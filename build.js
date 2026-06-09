const fs = require('fs');
const path = require('path');

const imageFolder = path.join(__dirname, 'images');
const outputFile = path.join(__dirname, 'images.json');

// 支持的图片格式
const exts = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

// 扫描所有图片
function scanImages() {
  if (!fs.existsSync(imageFolder)) {
    fs.mkdirSync(imageFolder);
  }

  const files = fs.readdirSync(imageFolder);
  const images = files
    .filter(f => exts.some(e => f.toLowerCase().endsWith(e)))
    .map(f => `./images/${f}`);

  fs.writeFileSync(outputFile, JSON.stringify(images, null, 2));
  console.log(`✅ 已扫描到 ${images.length} 张图片，生成 images.json 成功！`);
}

scanImages();