import { camera } from '../config/camera.js'
import { player } from '../config/player.js'
import { clamp } from '../utils/clamp.js'

const SENSITIVITY_X = 0.002
const SENSITIVITY_Y = 0.002

export const moveCamera = ({ movementX, movementY }, mainTag) => {
  if (document.pointerLockElement !== mainTag) return

  player.angle += movementX * SENSITIVITY_X

  const nextPitch = camera.pitch - movementY * SENSITIVITY_Y

  camera.pitch = clamp(nextPitch, -camera.pitchLimit, camera.pitchLimit)
}