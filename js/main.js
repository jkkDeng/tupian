const grid = document.getElementById('gridBox')
const loading = document.getElementById('loading')
const playBtn = document.getElementById('playBtn')
const nextBtn = document.getElementById('nextBtn')
const modeBtn = document.getElementById('modeBtn')

let imgList = []
let musicList = []
let audio = new Audio()
let currentMusic = 0
let isPlaying = false

function getBasePath() {
  const pathname = window.location.pathname
  const parts = pathname.split('/').filter(Boolean)
  if (parts.length && pathname.endsWith('/') && !parts[0].endsWith('.html')) {
    return `/${parts[0]}`
  }
  return ''
}
const base = getBasePath()

function showToast(msg) {
  const div = document.createElement('div')
  div.className = 'toast'
  div.innerText = msg
  document.body.appendChild(div)
  setTimeout(() => div.classList.add('show'), 10)
  setTimeout(() => {
    div.classList.remove('show')
    setTimeout(() => div.remove(), 300)
  }, 2000)
}

async function loadImages() {
  try {
    const res = await fetch(`${base}/images.json`)
    if (!res.ok) throw new Error('404')
    imgList = await res.json()
    renderImages()
  } catch (e) {
    loading.querySelector('div:last-child').innerText = '加载完成'
    setTimeout(() => {
      loading.style.opacity = 0
      setTimeout(()=>loading.remove(),300)
    },500)
  }
}

function renderImages() {
  imgList.forEach((src, i) => {
    const item = document.createElement('div')
    item.className = 'grid-item'

    const spin = document.createElement('div')
    spin.className = 'grid-loading'
    item.appendChild(spin)

    const img = document.createElement('img')
    img.loading = 'lazy'
    
    img.onload = () => {
      img.classList.add('loaded')
      spin.remove()
    }
    img.src = src
    item.appendChild(img)

    item.onclick = () => copyImg(src)
    grid.appendChild(item)

    if (i === 0) {
      const link = document.createElement('link')
      link.rel = 'icon'
      link.href = src
      document.head.appendChild(link)
    }
  })

  setTimeout(() => {
    loading.style.opacity = 0
    setTimeout(() => loading.remove(), 300)
  }, 600)
}

async function copyImg(src) {
  try {
    const res = await fetch(src)
    const blob = await res.blob()
    const item = new ClipboardItem({ 'image/png': blob })
    await navigator.clipboard.write([item])
    showToast('✅ 已复制图片')
  } catch (e) {
    showToast('❌ 复制失败，右键另存为')
  }
}

async function loadMusic() {
  try {
    const res = await fetch(`${base}/music.json`)
    if (!res.ok) return
    musicList = await res.json()
    if (musicList.length > 0) {
      const startPlay = () => {
        if (!isPlaying) autoPlay()
        document.removeEventListener('click', startPlay)
      }
      document.addEventListener('click', startPlay)
      autoPlay()
    }
  } catch (e) {}
}

function autoPlay() {
  play(0)
  audio.onended = () => {
    currentMusic = (currentMusic + 1) % musicList.length
    play(currentMusic)
  }
}

function play(i) {
  currentMusic = i
  audio.src = musicList[i]
  audio.play().then(() => {
    isPlaying = true
    playBtn.innerHTML = '<i class="fas fa-pause"></i>'
  }).catch(() => {
    isPlaying = false
    playBtn.innerHTML = '<i class="fas fa-play"></i>'
  })
}

playBtn.onclick = () => {
  if (!musicList.length) return
  if(isPlaying){
    audio.pause()
    isPlaying = false
    playBtn.innerHTML = '<i class="fas fa-play"></i>'
  }else{
    audio.play()
    isPlaying = true
    playBtn.innerHTML = '<i class="fas fa-pause"></i>'
  }
}

nextBtn.onclick = () => {
  if (musicList.length < 2) return
  currentMusic = (currentMusic + 1) % musicList.length
  play(currentMusic)
}

let dark = true
modeBtn.onclick = () => {
  dark = !dark
  document.body.classList.toggle('light', !dark)
  modeBtn.innerHTML = dark ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>'
}

window.addEventListener('DOMContentLoaded', () => {
  loadImages()
  loadMusic()
})