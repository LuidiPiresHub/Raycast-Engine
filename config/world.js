import { map } from './map.js'

const minimapSize = 500
const map3DSizeX = 1920
const map3DSizeY = 1080
const wallHeight = 2

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

const pixelSizeY = minimapSize / mapSizeY
const pixelSizeX = minimapSize / mapSizeX

export const world = {
  map,
  minimapSize,
  map3DSizeY,
  map3DSizeX,
  wallHeight,
  mapSizeY,
  mapSizeX,
  pixelSizeY,
  pixelSizeX,
}