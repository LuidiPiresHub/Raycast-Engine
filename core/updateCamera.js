import { camera } from '../config/camera.js'
import { player } from '../config/player.js'

export const updateCamera = (deltaTime) => {
  let targetFov = camera.walkFov
  let targetEyeHeight = camera.normalEyeHeight

  if (player.crouching) {
    targetEyeHeight = camera.crouchEyeHeight

    if (player.moving) {
      targetFov = camera.crouchFov
    }
  }

  if (player.running && player.moving) {
    targetFov = camera.runFov
  }

  const smooth = 8
  camera.fov += (targetFov - camera.fov) * smooth * deltaTime
  camera.eyeHeight += (targetEyeHeight - camera.eyeHeight) * smooth * deltaTime
}