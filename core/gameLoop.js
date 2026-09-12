import { movePlayer } from './movePlayer.js'
import { updateCamera } from './updateCamera.js'

export const createGameLoop = ({ textures, draw3DMap, drawPlayer }) => {
  let animationId = 0
  let lastTime = 0

  const loop = (currentTime) => {
    const deltaTime = Math.min((currentTime - lastTime) / 1000, 0.1)
    lastTime = currentTime

    movePlayer(deltaTime)
    updateCamera(deltaTime)

    drawPlayer()
    draw3DMap(textures)

    animationId = requestAnimationFrame(loop)
  }

  const start = () => {
    if (animationId) return

    lastTime = performance.now()
    animationId = requestAnimationFrame(loop)
  }

  const stop = () => {
    cancelAnimationFrame(animationId)
    animationId = 0
  }

  return { start, stop }
}