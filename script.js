import { createGameLoop } from './core/gameLoop.js'
import { createGameEvents } from './core/gameEvents.js'

import { draw3DMap } from './renderer/draw3DMap.js'
import { drawMinimap } from './renderer/drawMinimap.js'
import { drawPlayer } from './renderer/drawPlayer.js'
import { loadTexture } from './renderer/loadTexture.js'

const mainTag = document.querySelector('.main')
const menu = document.querySelector('.menu')

const textures = {
  wallTexture: null
}

const gameLoop = createGameLoop({
  textures,
  draw3DMap,
  drawPlayer
})

const events = createGameEvents({
  mainTag,
  menu,
  gameLoop
})

const startGame = async () => {
  events.register()

  await mainTag.requestFullscreen()
  await mainTag.requestPointerLock()
}

const main = async () => {
  textures.wallTexture = await loadTexture({
    url: './assets/backrooms.png',
    maxSize: 512
  })

  drawMinimap()
  drawPlayer()
  draw3DMap(textures)

  mainTag.addEventListener('click', startGame)
}

main()