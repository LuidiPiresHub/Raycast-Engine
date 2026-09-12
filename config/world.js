import { map } from './map.js'

const minimapSize = 500
const canvas_width = 1920
const canvas_height = 1080
const wallHeight = 3

const mapSize = Math.sqrt(map.length)

if (!Number.isInteger(mapSize)) {
  const message = `
    O Mapa deve ser quadrado
    Tamanho atual: ${map.length}
    Raiz: ${mapSize}
  `
  throw new Error(message)
}

const mapSizeY = mapSize
const mapSizeX = mapSize

const cellSizeY = minimapSize / mapSizeY
const cellSizeX = minimapSize / mapSizeX

export const world = {
  map,
  minimapSize,
  canvas_height,
  canvas_width,
  wallHeight,
  mapSizeY,
  mapSizeX,
  cellSizeY,
  cellSizeX,
}