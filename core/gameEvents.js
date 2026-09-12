import { updateKeysState } from './keyboard.js'
import { moveCamera } from './moveCamera.js'

export const createGameEvents = ({ mainTag, menu, gameLoop }) => {
  let registered = false

  const handleMouseMove = (event) => {
    moveCamera(event, mainTag)
  }

  const handleFullscreenChange = () => {
    const isFullscreen = document.fullscreenElement === mainTag

    if (isFullscreen) {
      menu.classList.add('hidden')
      gameLoop.start()
      return
    }

    menu.classList.remove('hidden')
    gameLoop.stop()
  }

  const register = () => {
    if (registered) return

    registered = true

    document.addEventListener('keydown', updateKeysState)
    document.addEventListener('keyup', updateKeysState)
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('fullscreenchange', handleFullscreenChange)
  }

  return { register }
}