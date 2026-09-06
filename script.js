import { camera } from './config/camera.js'
import { player } from './config/player.js'
import { world } from './config/world.js'
import { updateKeysState } from './core/keyboard.js'
import { movePlayer } from './core/movePlayer.js'
import { updateCamera } from './core/updateCamera.js'
import { draw3DMap } from './renderer/draw3DMap.js'
import { drawMinimap } from './renderer/drawMinimap.js'
import { drawPlayer } from './renderer/drawPlayer.js'

const mainTag = document.querySelector('.main')
const menu = document.querySelector('.menu')

let animationId = 0;
let lastTime = 0
let started = false

const textures = {
  wallTexture: null
}

const loop = (currentTime) => {
  const deltaTime = Math.min((currentTime - lastTime) / 1000, 0.1)
  lastTime = currentTime

  drawPlayer()
  movePlayer(deltaTime)
  updateCamera(deltaTime)
  draw3DMap(textures)
  animationId = requestAnimationFrame(loop)
}

const setEvents = () => {
  started = true

  const { map3DSizeY } = world

  document.addEventListener('keydown', updateKeysState)
  document.addEventListener('keyup', updateKeysState)

  document.addEventListener('mousemove', ({ movementX, movementY }) => {
    if (document.pointerLockElement === mainTag) {
      const sensitivityX = 0.002
      const sensitivityY = 1.3
      const nextPitch = camera.pitch - movementY * sensitivityY

      player.angle += movementX * sensitivityX
      camera.pitch = Math.max(-map3DSizeY, Math.min(map3DSizeY, nextPitch));
    }
  });

  document.addEventListener('fullscreenchange', () => {
    if (document.fullscreenElement === mainTag) {
      menu.classList.add('hidden')
      lastTime = performance.now()

      if (!animationId) {
        animationId = requestAnimationFrame(loop)
      }

    } else {
      menu.classList.remove('hidden')
      cancelAnimationFrame(animationId)
      animationId = 0
    }
  })
}

const startGame = async () => {
  if (!started) setEvents()
  await mainTag.requestFullscreen()
  await mainTag.requestPointerLock()
}

const loadTexture = async ({ url, maxSize }) => {
  const img = new Image()
  img.src = url
  await img.decode()

  const w = img.width
  const h = img.height

  const scale = Math.min(
    maxSize / w,
    maxSize / h
  )

  const width = Math.max(1, Math.round(w * scale))
  const height = Math.max(1, Math.round(h * scale))

  const canvasAux = document.createElement('canvas')
  const auxCtx = canvasAux.getContext('2d')

  const repeats = Math.ceil(world.wallHeight)

  canvasAux.width = width
  canvasAux.height = height * repeats

  for (let i = 0; i < repeats; i++) {
    auxCtx.drawImage(img, 0, i * height, width, height)
  }

  return {
    canvas: canvasAux,
    canvasWidth: canvasAux.width,
    canvasHeight: canvasAux.height,
    textureWidth: width,
    textureHeight: height,
  }
}

const main = async () => {
  textures.wallTexture = await loadTexture({ url: './assets/backrooms.png', maxSize: 512 })
  drawMinimap()
  drawPlayer()
  draw3DMap(textures)

  mainTag.addEventListener('click', startGame);
}

main()