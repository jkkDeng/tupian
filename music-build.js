const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const theme = args[0] || '';
const basePath = theme ? `./${theme}` : '.';

const musicFolder = path.join(basePath, 'music');
const outputFile = path.join(basePath, 'music.json');

// 自动创建 music 文件夹（如果不存在）
if (!fs.existsSync(musicFolder)) {
  fs.mkdirSync(musicFolder, { recursive: true });
  console.log('✅ 已自动创建 music 文件夹');
}

// 支持的音乐格式
const musicExts = ['.mp3', '.ogg', '.wav', '.flac', '.m4a'];

// 读取音乐文件
const files = fs.readdirSync(musicFolder);
const musicList = files
  .filter(file => musicExts.some(ext => file.toLowerCase().endsWith(ext)))
  .map(file => (theme ? `/${theme}/music/${file}` : `./music/${file}`));

// 写入 JSON
fs.writeFileSync(outputFile, JSON.stringify(musicList, null, 2));
console.log(`🎵 已生成音乐清单：${musicList.length} 首`);