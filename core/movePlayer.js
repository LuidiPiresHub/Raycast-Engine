import { camera } from '../config/camera.js'
import { player } from '../config/player.js'
import { world } from '../config/world.js'
import { clamp } from '../utils/clamp.js'
import { keysMap } from './keyboard.js'

const { map, mapSizeX } = world

const canMove = (x, y) => map[y * mapSizeX + x] === 0

export const movePlayer = (deltaTime) => {
  let nextX = player.x
  let nextY = player.y
  let speed = player.walkSpeed
  let moveX = 0
  let moveY = 0

  const isMoving =
    keysMap['KeyW'] ||
    keysMap['KeyS'] ||
    keysMap['KeyA'] ||
    keysMap['KeyD']

  player.moving = isMoving
  player.running = false
  player.crouching = false

  if (keysMap['ShiftLeft'] && player.moving) {
    speed = player.runSpeed
    player.running = true
  } else if (keysMap['ControlLeft'] || keysMap['KeyC']) {
    speed = player.crouchSpeed
    player.crouching = true
  }

  const dirX = Math.cos(player.angle)
  const dirY = Math.sin(player.angle)

  const perpX = Math.cos(player.angle + Math.PI / 2)
  const perpY = Math.sin(player.angle + Math.PI / 2)

  if (keysMap['KeyW']) {
    moveX += dirX
    moveY += dirY
  }

  if (keysMap['KeyS']) {
    moveX -= dirX
    moveY -= dirY
  }

  if (keysMap['KeyA']) {
    moveX -= perpX
    moveY -= perpY
  }

  if (keysMap['KeyD']) {
    moveX += perpX
    moveY += perpY
  }

  const moveLength = Math.hypot(moveX, moveY)

  if (moveLength > 0) {
    nextX += (moveX / moveLength) * speed * deltaTime
    nextY += (moveY / moveLength) * speed * deltaTime
  }

  if (keysMap['ArrowUp']) {
    const nextPitch = camera.pitch + player.pitchSpeed * deltaTime
    camera.pitch = clamp(nextPitch, -camera.pitchLimit, camera.pitchLimit)
  }

  if (keysMap['ArrowDown']) {
    const nextPitch = camera.pitch - player.pitchSpeed * deltaTime
    camera.pitch = clamp(nextPitch, -camera.pitchLimit, camera.pitchLimit)
  }

  if (keysMap['ArrowLeft']) player.angle -= player.turnSpeed * deltaTime
  if (keysMap['ArrowRight']) player.angle += player.turnSpeed * deltaTime

  const currentX = Math.floor(player.x)
  const currentY = Math.floor(player.y)

  const nextTileX = Math.floor(nextX)
  const nextTileY = Math.floor(nextY)

  if (canMove(nextTileX, currentY)) {
    player.x = nextX
  }

  if (canMove(currentX, nextTileY)) {
    player.y = nextY
  }
}