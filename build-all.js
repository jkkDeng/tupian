const fs = require('fs')
const path = require('path')

// ==========================
// 配置：你以后加主题只在这里加一行！
// ==========================
const THEMES = [
  '',          // 根目录（主站）
  'huoying'    // 火影主题
]

// 支持的图片格式
const IMG_EXTS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg']
// 支持的音乐格式
const MUSIC_EXTS = ['.mp3', '.m4a', '.wav', '.ogg', '.flac', '.wma']

// ==========================
// 自动生成所有主题
// ==========================
async function buildAll() {
  for (const theme of THEMES) {
    const base = theme ? `./${theme}` : '.'

    // 1. 生成 images.json
    buildFile(
      path.join(base, 'images'),
      path.join(base, 'images.json'),
      IMG_EXTS,
      f => theme ? `/${theme}/images/${f}` : `./images/${f}`
    )

    // 2. 生成 music.json
    buildFile(
      path.join(base, 'music'),
      path.join(base, 'music.json'),
      MUSIC_EXTS,
      f => theme ? `/${theme}/music/${f}` : `./music/${f}`
    )
  }

  console.log('\n✅ 所有主题 图片 + 音乐 扫描完成！')
}

// ==========================
// 通用生成函数（不用改）
// ==========================
function buildFile(dirPath, outPath, exts, pathMapper) {
  try {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true })
    }

    const files = fs.readdirSync(dirPath)
    const list = files
      .filter(f => exts.some(e => f.toLowerCase().endsWith(e)))
      .map(pathMapper)

    fs.writeFileSync(outPath, JSON.stringify(list, null, 2))
    console.log(`📦 已生成：${outPath} (${list.length} 个)`)
  } catch (e) {
    console.log(`⚠️  跳过：${outPath}`)
  }
}

// 启动
buildAll()