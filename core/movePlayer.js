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
    player.moving = true
    nextX += dirX * speed * deltaTime
    nextY += dirY * speed * deltaTime
  }

  if (keysMap['KeyS']) {
    player.moving = true
    nextX -= dirX * speed * deltaTime
    nextY -= dirY * speed * deltaTime
  }

  if (keysMap['KeyA']) {
    player.moving = true
    nextX -= perpX * speed * deltaTime
    nextY -= perpY * speed * deltaTime
  }

  if (keysMap['KeyD']) {
    player.moving = true
    nextX += perpX * speed * deltaTime
    nextY += perpY * speed * deltaTime
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