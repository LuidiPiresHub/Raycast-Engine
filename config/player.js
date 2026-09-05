import { degToRad } from '../utils/degToRad.js';

export const player = {
  x: 2,
  y: 4.5,
  angle: degToRad(0),
  radius: 0.2,

  walkSpeed: 3,
  runSpeed: 6,
  crouchSpeed: 1,
  turnSpeed: 3,
  pitchSpeed: 30,

  moving: false,
  running: false,
  crouching: false,
}