import { camera } from '../config/camera.js'
import { world } from '../config/world.js'
import { castRay } from '../core/castRay.js'

const { canvas_width, canvas_height, wallHeight } = world

const columnWidth = canvas_width / camera.map3DRays

const MAX_LIGHT_DISTANCE = 24
const MIN_BRIGHTNESS = 0.10
const BRIGHTNESS_RANGE = 1 - MIN_BRIGHTNESS

const FACING_WEIGHT = 0.35
const FACING_BASE = 1 - FACING_WEIGHT

const FLASHLIGHT_AMBIENT = 0.10
const FLASHLIGHT_RANGE = 1 - FLASHLIGHT_AMBIENT
const FLASHLIGHT_POWER = 2.8

const VERTICAL_SPREAD = 1.35
const HALF_CANVAS_HEIGHT = canvas_height * 0.5

const rayPositions = new Float32Array(camera.map3DRays)
const rayHorizontal = new Float32Array(camera.map3DRays)
const rayScreenX = new Float32Array(camera.map3DRays)

const preCalc = () => {
  for (let i = 0; i < camera.map3DRays; i++) {
    const planeXPosition = 2 * (i + 0.5) / camera.map3DRays - 1

    rayPositions[i] = planeXPosition
    rayHorizontal[i] = Math.abs(planeXPosition)
    rayScreenX[i] = i * columnWidth
  }
}

preCalc()

export const drawWalls = (renderData, textures) => {
  const {
    ctx,
    horizon,
    dirX,
    dirY,
    planeX,
    planeY
  } = renderData

  const { wallTexture } = textures

  const topRelative = wallHeight - camera.eyeHeight
  const bottomRelative = -camera.eyeHeight

  for (let i = 0; i < camera.map3DRays; i++) {
    const planeXPosition = rayPositions[i]

    const rayDirX = dirX + planeX * planeXPosition
    const rayDirY = dirY + planeY * planeXPosition

    const { distance, wallX, facing } = castRay(rayDirX, rayDirY)

    const topScreen = horizon - (topRelative / distance) * canvas_height
    const bottomScreen = horizon - (bottomRelative / distance) * canvas_height

    const clippedTop = Math.max(0, topScreen)
    const clippedBottom = Math.min(canvas_height, bottomScreen)

    const visibleHeight = clippedBottom - clippedTop
    if (visibleHeight <= 0) continue

    const x = rayScreenX[i]
    const wallScreenHeight = bottomScreen - topScreen
    const textureSourceY = ((clippedTop - topScreen) / wallScreenHeight) * wallTexture.canvasHeight
    const textureSourceHeight = (visibleHeight / wallScreenHeight) * wallTexture.canvasHeight
    const wallTextureX = Math.floor(wallX * wallTexture.textureWidth)

    ctx.drawImage(
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

    const distanceFactor = Math.max(0, 1 - distance / MAX_LIGHT_DISTANCE)
    const distanceBrightness = MIN_BRIGHTNESS + BRIGHTNESS_RANGE * distanceFactor * distanceFactor
    const horizontal = rayHorizontal[i]
    const wallCenter = (clippedTop + clippedBottom) * 0.5
    const vertical = (wallCenter - horizon) / HALF_CANVAS_HEIGHT
    const verticalNormalized = vertical / VERTICAL_SPREAD

    const flashlightDistance = Math.sqrt(
      horizontal * horizontal +
      verticalNormalized * verticalNormalized
    )

    const flashlightShape = Math.max(0, 1 - flashlightDistance)
    const flashlightFactor = FLASHLIGHT_AMBIENT + FLASHLIGHT_RANGE * Math.pow(flashlightShape, FLASHLIGHT_POWER)
    const facingBrightness = FACING_BASE + facing * FACING_WEIGHT
    const brightness = distanceBrightness * flashlightFactor * facingBrightness
    const darkness = 1 - brightness

    ctx.fillStyle = `rgba(0, 0, 0, ${darkness})`
    ctx.fillRect(
      Math.floor(x),
      Math.floor(clippedTop),
      Math.ceil(columnWidth),
      Math.ceil(visibleHeight)
    )
  }
}