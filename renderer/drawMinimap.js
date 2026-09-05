import { world } from '../config/world.js'

const minimap = document.querySelector('.minimap')
const minimapCtx = minimap.getContext('2d')

const { minimapSize, mapSizeY, mapSizeX, map, pixelSizeY, pixelSizeX } = world

minimap.height = minimapSize
minimap.width = minimapSize

const colorMap = {
  0: 'white',
  1: 'black',
}

export const drawMinimap = () => {
  minimapCtx.clearRect(0, 0, minimapSize, minimapSize)

  for (let y = 0; y < mapSizeY; y++) {
    for (let x = 0; x < mapSizeX; x++) {
      const chunk = map[y * mapSizeX + x]
      minimapCtx.fillStyle = colorMap[chunk]
      minimapCtx.fillRect(
        Math.floor(x * pixelSizeX),
        Math.floor(y * pixelSizeY),
        Math.ceil(pixelSizeX),
        Math.ceil(pixelSizeY)
      )
    }
  }
}