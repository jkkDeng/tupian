const fs = require('fs')
const path = require('path')

const IMAGES_DIR = path.join(__dirname, 'images')
const OUTPUT = path.join(__dirname, 'images.json')

const ALLOW = ['.jpg', '.jpeg', '.png', '.gif', '.webp']

function scan() {
  if (!fs.existsSync(IMAGES_DIR)) fs.mkdirSync(IMAGES_DIR)

  const files = fs.readdirSync(IMAGES_DIR)
  const list = files
    .filter(f => ALLOW.some(e => f.toLowerCase().endsWith(e)))
    .map(f => `./images/${f}`)

  fs.writeFileSync(OUTPUT, JSON.stringify(list, null, 2))
  console.log(`✅ 已扫描到 ${list.length} 张图片，已更新 images.json`)
}

scan()