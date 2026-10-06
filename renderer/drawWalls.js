import { camera } from '../config/camera.js'
import { world } from '../config/world.js'
import { castRay } from '../core/castRay.js'

const { canvas_width, canvas_height, wallHeight } = world

const columnWidth = canvas_width / camera.map3DRays

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

  }
}