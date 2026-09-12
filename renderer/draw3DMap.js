import { camera } from '../config/camera.js'
import { world } from '../config/world.js'
import { castRay } from '../core/castRay.js'
import { getCameraPlane } from '../core/getCameraPlane.js'

const map3D = document.querySelector('.map3D')
const map3DCtx = map3D.getContext('2d')

const { map3DSizeY, map3DSizeX, wallHeight } = world

map3D.height = map3DSizeY
map3D.width = map3DSizeX

const columnWidth = map3DSizeX / camera.map3DRays

const MAX_LIGHT_DISTANCE = 30
const MIN_BRIGHTNESS = 0.5
const DISTANCE_WEIGHT = 0.7
const FACING_WEIGHT = 0.3

export const draw3DMap = ({ wallTexture }) => {
  map3DCtx.clearRect(0, 0, map3DSizeX, map3DSizeY)

  const horizon = map3DSizeY / 2 + camera.pitch * map3DSizeY

  map3DCtx.fillStyle = 'rgb(172, 170, 90)'
  map3DCtx.fillRect(0, 0, map3DSizeX, horizon)

  map3DCtx.fillStyle = 'rgb(143, 132, 65)'
  map3DCtx.fillRect(0, horizon, map3DSizeX, map3DSizeY - horizon)

  const { dirX, dirY, planeX, planeY } = getCameraPlane()

  const topRelative = wallHeight - camera.eyeHeight
  const bottomRelative = -camera.eyeHeight

  for (let i = 0; i < camera.map3DRays; i++) {
    const planeXPosition = 2 * (i + 0.5) / camera.map3DRays - 1

    const rayDirX = dirX + (planeX * planeXPosition)
    const rayDirY = dirY + (planeY * planeXPosition)

    const { distance, wallX, facing } = castRay(rayDirX, rayDirY)

    const topScreen = horizon - (topRelative / distance) * map3DSizeY
    const bottomScreen = horizon - (bottomRelative / distance) * map3DSizeY

    const clippedTop = Math.max(0, topScreen)
    const clippedBottom = Math.min(map3DSizeY, bottomScreen)

    const visibleHeight = clippedBottom - clippedTop

    if (visibleHeight <= 0) continue

    const x = i * columnWidth
    const wallScreenHeight = bottomScreen - topScreen

    const textureSourceY = ((clippedTop - topScreen) / wallScreenHeight) * wallTexture.canvasHeight

    const textureSourceHeight = (visibleHeight / wallScreenHeight) * wallTexture.canvasHeight

    const wallTextureX = Math.floor(wallX * wallTexture.textureWidth)

    map3DCtx.drawImage(
      wallTexture.canvas,

      wallTextureX,
      textureSourceY,
      1,
      textureSourceHeight,

      Math.floor(x),
      Math.floor(clippedTop),
      Math.ceil(columnWidth),
      Math.ceil(visibleHeight)
    )

    const distanceBrightness = Math.max(MIN_BRIGHTNESS, 1 - distance / MAX_LIGHT_DISTANCE)
    const brightness = distanceBrightness * DISTANCE_WEIGHT + facing * FACING_WEIGHT
    const darkness = 1 - brightness

    map3DCtx.fillStyle = `rgba(0, 0, 0, ${darkness})`
    map3DCtx.fillRect(Math.floor(x), topScreen, Math.ceil(columnWidth), wallScreenHeight)
  }
}