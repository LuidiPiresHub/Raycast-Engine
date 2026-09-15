import { camera } from '../config/camera.js'
import { world } from '../config/world.js'
import { getCameraPlane } from '../core/getCameraPlane.js'
import { drawWalls } from './drawWalls.js'
import { drawFloor } from './drawFloor.js'
// import { drawCeiling } from './drawCeiling.js' 

const map3D = document.querySelector('.map3D')
const map3DCtx = map3D.getContext('2d')

const { canvas_width, canvas_height } = world

map3D.width = canvas_width
map3D.height = canvas_height

export const draw3DMap = (textures) => {
  const incio = performance.now()

  const horizon = canvas_height / 2 + camera.pitch * canvas_height
  const cameraPlane = getCameraPlane()

  const renderData = { ctx: map3DCtx, horizon, ...cameraPlane }

  map3DCtx.clearRect(0, 0, canvas_width, canvas_height) // Remover depois
  //  // drawCeiling(renderData, textures)
  // drawFloor(renderData, textures)
  drawWalls(renderData, textures)

  const fim = performance.now()
  console.log(`${(fim - incio).toFixed(2)} ms`)
}