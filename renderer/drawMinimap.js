import { world } from '../config/world.js'

const minimap = document.querySelector('.minimap')
const minimapCtx = minimap.getContext('2d')

const { minimapSize, mapSizeY, mapSizeX, map, cellSizeY, cellSizeX } = world

minimap.height = minimapSize
minimap.width = minimapSize

const colorMap = {
  0: 'white',
  1: 'black',
}

export const drawMinimap = () => {
  for (let y = 0; y < mapSizeY; y++) {
    for (let x = 0; x < mapSizeX; x++) {
      const chunk = map[y * mapSizeX + x]
      minimapCtx.fillStyle = colorMap[chunk]
      minimapCtx.fillRect(
        Math.floor(x * cellSizeX),
        Math.floor(y * cellSizeY),
        Math.ceil(cellSizeX),
        Math.ceil(cellSizeY)
      )
    }
  }
}