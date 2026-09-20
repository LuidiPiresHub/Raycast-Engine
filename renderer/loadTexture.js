import { world } from '../config/world.js'

export const loadTexture = async ({ url, maxSize, repeat = false }) => {
  const img = new Image()
  img.src = url
  await img.decode()

  const w = img.width
  const h = img.height

  const scale = Math.min(
    maxSize / w,
    maxSize / h
  )

  const width = Math.max(1, Math.round(w * scale))
  const height = Math.max(1, Math.round(h * scale))

  const canvasAux = document.createElement('canvas')
  const auxCtx = canvasAux.getContext('2d')

  const repeats = repeat ? Math.ceil(world.wallHeight) : 1

  canvasAux.width = width
  canvasAux.height = height * repeats

  for (let i = 0; i < repeats; i++) {
    auxCtx.drawImage(img, 0, i * height, width, height)
  }

  const imageData = auxCtx.getImageData(0, 0, canvasAux.width, canvasAux.height)
  const buffer = new Uint32Array(imageData.data.buffer)

  return {
    canvas: canvasAux,
    buffer: buffer,
    canvasWidth: canvasAux.width,
    canvasHeight: canvasAux.height,
    textureWidth: width,
    textureHeight: height,
  }
}

