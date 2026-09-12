import { degToRad } from '../utils/degToRad.js'
import { world } from './world.js'

export const camera = {
  fov: degToRad(80),
  walkFov: degToRad(80),
  runFov: degToRad(80),
  crouchFov: degToRad(80),

  pitch: 0,
  pitchLimit: degToRad(90),

  eyeHeight: 1,
  normalEyeHeight: 1,
  crouchEyeHeight: 0.4,

  minimapRays: world.minimapSize,
  map3DRays: world.canvas_width,
}