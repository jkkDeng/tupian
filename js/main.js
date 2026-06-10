// DOM 元素获取
const grid = document.getElementById('gridBox')
const loading = document.getElementById('loading')
const floatMenu = document.getElementById('floatMenu')
const mainMenu = document.getElementById('mainMenu')
const menuTrigger = document.getElementById('menuTrigger')
const playBtn = document.getElementById('playBtn')
const nextBtn = document.getElementById('nextBtn')
const modeBtn = document.getElementById('modeBtn')
const posLeft = document.getElementById('posLeft')
const posTop = document.getElementById('posTop')
const posBottom = document.getElementById('posBottom')
const posRight = document.getElementById('posRight')

// 全局变量
let imgList = []
let musicList = []
let audio = new Audio()
let currentMusic = 0
let isPlaying = false
let menuPos = 'right' // 默认菜单靠右

// ========== 路径兼容：本地 Live Server + 线上 GitHub 双适配 ==========
function getBasePath() {
  const pathname = window.location.pathname
  const pathArr = pathname.split('/').filter(item => item)
  // 识别子目录（火影等主题）
  if (pathArr.length > 0 && pathArr[0] !== 'css' && pathArr[0] !== 'js') {
    return `/${pathArr[0]}`
  }
  return ''
}
const base = getBasePath()

// ========== 加载图片列表 ==========
async function loadImages() {
  try {
    const imgJsonUrl = `${base}/images.json`
    const res = await fetch(imgJsonUrl)
    if (!res.ok) throw new Error('图片清单不存在')

    imgList = await res.json()
    showImages()
  } catch (err) {
    loading.querySelector('div:last-child').innerText = "图片资源加载失败"
    console.error('图片加载错误：', err)
  }
}

// ========== 加载音乐列表 + 自动播放 ==========
async function loadMusic() {
  try {
    const musicJsonUrl = `${base}/music.json`
    const res = await fetch(musicJsonUrl)
    if (!res.ok) throw new Error('音乐清单不存在')

    musicList = await res.json()
    if (musicList.length > 0) {
      // 浏览器自动播放策略：先加载，用户任意交互后自动播放
      document.addEventListener('click', () => {
        if (!isPlaying) autoPlay()
      }, { once: true })
      // 延迟尝试自动播放
      setTimeout(() => {
        autoPlay()
      }, 800)
    }
  } catch (err) {
    console.log('暂无音乐资源', err)
  }
}

// ========== 渲染图片网格 ==========
function showImages() {
  imgList.forEach((src, index) => {
    const item = document.createElement('div')
    item.className = 'grid-item'

    const img = document.createElement('img')
    img.src = src
    img.alt = "图片"
    item.appendChild(img)
    grid.appendChild(item)

    // 点击复制图片（支持微信粘贴）
    item.onclick = () => copyImage(src)

    // 图片悬浮3D效果
    item.onmousemove = (e) => {
      const rect = item.getBoundingClientRect()
      const rx = (e.clientY - rect.top) / rect.height - 0.5
      const ry = (e.clientX - rect.left) / rect.width - 0.5
      item.style.transform = `rotateX(${rx * -9}deg) rotateY(${ry * 9}deg) scale(1.1)`
      item.style.boxShadow = 'inset -8px -8px 15px rgba(138,109,255,.4), 0 0 12px #8a6dff'
    }

    item.onmouseleave = () => {
      item.style.transform = ''
      item.style.boxShadow = ''
    }

    // 第一张图设为浏览器图标
    if (index === 0) {
      const favicon = document.createElement('link')
      favicon.rel = 'icon'
      favicon.href = src
      document.head.appendChild(favicon)
    }
  })

  // 关闭加载动画
  setTimeout(() => {
    loading.style.opacity = 0
    setTimeout(() => loading.style.display = 'none', 300)
  }, 600)
}

// ========== 复制图片到剪贴板（微信可用） ==========
async function copyImage(src) {
  try {
    const res = await fetch(src)
    const blob = await res.blob()
    const clipItem = new ClipboardItem({ 'image/png': blob })
    await navigator.clipboard.write([clipItem])
    alert('✅ 图片已复制，可直接粘贴到微信/QQ')
  } catch (err) {
    alert('❌ 复制失败，请使用最新浏览器')
    console.error('复制错误：', err)
  }
}

// ========== 音乐播放逻辑 ==========
function autoPlay() {
  if (musicList.length === 0) return
  playMusic(0)
  // 单曲播放完毕 → 下一首，循环
  audio.loop = false
  audio.onended = () => {
    currentMusic = (currentMusic + 1) % musicList.length
    playMusic(currentMusic)
  }
}

function playMusic(index) {
  currentMusic = index
  audio.src = musicList[index]
  audio.play().then(() => {
    isPlaying = true
    playBtn.innerHTML = '<i class="fas fa-pause"></i>'
  }).catch(() => {
    // 浏览器拦截自动播放，等待用户点击触发
    isPlaying = false
    playBtn.innerHTML = '<i class="fas fa-play"></i>'
  })
}

// 播放/暂停切换
playBtn.onclick = () => {
  if (musicList.length === 0) return
  if (isPlaying) {
    audio.pause()
    isPlaying = false
    playBtn.innerHTML = '<i class="fas fa-play"></i>'
  } else {
    audio.play()
    isPlaying = true
    playBtn.innerHTML = '<i class="fas fa-pause"></i>'
  }
}

// 下一首
nextBtn.onclick = () => {
  if (musicList.length < 2) return
  currentMusic = (currentMusic + 1) % musicList.length
  playMusic(currentMusic)
}

// ========== 菜单位置切换（核心修复：左/右/上/下 触发区域） ==========
function updateMenuPosition(pos) {
  menuPos = pos
  // 重置所有样式
  floatMenu.style = ''
  menuTrigger.style = ''
  mainMenu.style.transform = 'translateX(100%)'

  // 菜单靠右（默认）
  if (pos === 'right') {
    floatMenu.style.position = 'fixed'
    floatMenu.style.right = '0'
    floatMenu.style.top = '50%'
    floatMenu.style.transform = 'translateY(-50%)'
    menuTrigger.style.right = '0'
    menuTrigger.style.top = '0'
    menuTrigger.style.width = '12px'
    menuTrigger.style.height = '100vh'
  }

  // 菜单靠左
  if (pos === 'left') {
    floatMenu.style.position = 'fixed'
    floatMenu.style.left = '0'
    floatMenu.style.top = '50%'
    floatMenu.style.transform = 'translateY(-50%)'
    menuTrigger.style.left = '0'
    menuTrigger.style.top = '0'
    menuTrigger.style.width = '12px'
    menuTrigger.style.height = '100vh'
  }

  // 菜单靠上
  if (pos === 'top') {
    floatMenu.style.position = 'fixed'
    floatMenu.style.left = '50%'
    floatMenu.style.top = '0'
    floatMenu.style.transform = 'translateX(-50%)'
    menuTrigger.style.left = '0'
    menuTrigger.style.top = '0'
    menuTrigger.style.width = '100vw'
    menuTrigger.style.height = '12px'
  }

  // 菜单靠下
  if (pos === 'bottom') {
    floatMenu.style.position = 'fixed'
    floatMenu.style.left = '50%'
    floatMenu.style.bottom = '0'
    floatMenu.style.transform = 'translateX(-50%)'
    menuTrigger.style.left = '0'
    menuTrigger.style.bottom = '0'
    menuTrigger.style.width = '100vw'
    menuTrigger.style.height = '12px'
  }
}

// 绑定位置按钮
posLeft.onclick = () => updateMenuPosition('left')
posRight.onclick = () => updateMenuPosition('right')
posTop.onclick = () => updateMenuPosition('top')
posBottom.onclick = () => updateMenuPosition('bottom')

// ========== 日夜模式切换 ==========
let isDark = true
modeBtn.onclick = () => {
  isDark = !isDark
  document.body.classList.toggle('light', !isDark)
  modeBtn.innerHTML = isDark ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>'
}

// ========== 页面入口：开始加载资源 ==========
window.addEventListener('DOMContentLoaded', () => {
  loadImages()
  loadMusic()
})