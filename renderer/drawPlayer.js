import { world } from '../config/world.js'
import { player } from '../config/player.js'
import { castRay } from '../core/castRay.js'
import { camera } from '../config/camera.js'
import { getCameraPlane } from '../core/getCameraPlane.js'

const playerMap = document.querySelector('.playerMap')
const playerMapCtx = playerMap.getContext('2d')

const { minimapSize, cellSizeY, cellSizeX } = world

playerMap.height = minimapSize
playerMap.width = minimapSize

const defaultArrowOptions = {
  color: 'red',
  tip: 2,
  wing: 1,
  back: 1,
  notch: 0.3,
}

const drawArrow = (x, y, angle, size, options = defaultArrowOptions) => {
  const dirX = Math.cos(angle)
  const dirY = Math.sin(angle)

  const perpX = -dirY
  const perpY = dirX

  playerMapCtx.fillStyle = options.color

  playerMapCtx.beginPath()

  playerMapCtx.moveTo(
    x + dirX * size * options.tip,
    y + dirY * size * options.tip,
  )

  playerMapCtx.lineTo(
    x - dirX * size * options.back + perpX * size * options.wing,
    y - dirY * size * options.back + perpY * size * options.wing,
  )

  playerMapCtx.lineTo(
    x - dirX * size * options.notch,
    y - dirY * size * options.notch,
  )

  playerMapCtx.lineTo(
    x - dirX * size * options.back - perpX * size * options.wing,
    y - dirY * size * options.back - perpY * size * options.wing,
  )

  playerMapCtx.closePath()
  playerMapCtx.fill()
}

playerMapCtx.lineWidth = 5
playerMapCtx.strokeStyle = 'lime'

const drawRays = () => {
  const { dirX, dirY, planeX, planeY } = getCameraPlane()

  for (let i = 0; i < camera.minimapRays; i++) {
    const planeXPosition = 2 * (i + 0.5) / camera.minimapRays - 1

    const rayDirX = dirX + (planeX * planeXPosition)
    const rayDirY = dirY + (planeY * planeXPosition)

    const { hitX, hitY } = castRay(rayDirX, rayDirY)

    playerMapCtx.beginPath()

    playerMapCtx.moveTo(
      player.x * cellSizeX,
      player.y * cellSizeY,
    )

    playerMapCtx.lineTo(
      hitX * cellSizeX,
      hitY * cellSizeY,
    )

    playerMapCtx.stroke()
  }
}

export const drawPlayer = () => {
  playerMapCtx.clearRect(0, 0, minimapSize, minimapSize)

  drawRays()

  drawArrow(
    player.x * cellSizeX,
    player.y * cellSizeY,
    player.angle,
    Math.min(cellSizeX, cellSizeY) * 0.8,
  )
}
