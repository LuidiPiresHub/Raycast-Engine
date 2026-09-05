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

export const draw3DMap = () => {
  map3DCtx.clearRect(0, 0, map3DSizeX, map3DSizeY)

  const horizon = map3DSizeY / 2 + camera.pitch

  map3DCtx.fillStyle = 'dodgerblue'
  map3DCtx.fillRect(0, 0, map3DSizeX, horizon)

  map3DCtx.fillStyle = 'green'
  map3DCtx.fillRect(0, horizon, map3DSizeX, map3DSizeY - horizon)

  const { dirX, dirY, planeX, planeY } = getCameraPlane()  

  for (let i = 0; i < camera.map3DRays; i++) {
    const planeXPosition =  2 * (i + 0.5) / camera.map3DRays - 1

    const rayDirX = dirX + (planeX * planeXPosition)
    const rayDirY = dirY + (planeY * planeXPosition)

    const { distance, facing } = castRay(rayDirX, rayDirY)

    const topRelative = wallHeight - camera.eyeHeight
    const bottomRelative = -camera.eyeHeight

    const topScreen = horizon - (topRelative / distance) * map3DSizeY
    const bottomScreen = horizon - (bottomRelative / distance) * map3DSizeY

    const wallScreenHeight = bottomScreen - topScreen
    const x = i * columnWidth

    const distanceBrightness = Math.max(MIN_BRIGHTNESS, 1 - distance / MAX_LIGHT_DISTANCE)
    const brightness = distanceBrightness * DISTANCE_WEIGHT + facing * FACING_WEIGHT
    const color = Math.floor(255 * brightness)

    map3DCtx.fillStyle = `rgb(${color}, ${color}, ${color})`

    map3DCtx.fillRect(Math.floor(x), topScreen, Math.ceil(columnWidth), wallScreenHeight)
  }
}
