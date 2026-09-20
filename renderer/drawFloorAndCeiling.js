import { world } from '../config/world.js'

const { canvas_width, canvas_height } = world

export const drawFloorAndCeiling = (renderData) => {
  const { ctx, horizon } = renderData

  const ceilingGradient = ctx.createLinearGradient(0, 0, 0, horizon)

  ceilingGradient.addColorStop(0, 'rgb(18, 18, 7)')
  ceilingGradient.addColorStop(1, 'rgb(38, 37, 18)')

  ctx.fillStyle = ceilingGradient
  ctx.fillRect(0, 0, canvas_width, horizon)

  const floorGradient = ctx.createLinearGradient(0, horizon, 0, canvas_height)

  floorGradient.addColorStop(0, 'rgb(7, 7, 3)')
  floorGradient.addColorStop(1, 'rgb(19, 19, 9)')

  ctx.fillStyle = floorGradient
  ctx.fillRect(0, horizon, canvas_width, canvas_height - horizon)
}