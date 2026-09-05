import { camera } from '../config/camera.js'
import { player } from '../config/player.js'

export const getCameraPlane = () => {
  const halfPlaneLength = Math.tan(camera.fov / 2)

  const dirX = Math.cos(player.angle)
  const dirY = Math.sin(player.angle)

  const planeX = -dirY * halfPlaneLength
  const planeY = dirX * halfPlaneLength

  return { dirX, dirY, planeX, planeY }
}