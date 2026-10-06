import { world } from '../config/world.js'

const { canvas_width, canvas_height } = world

export const drawFloorAndCeiling = (renderData) => {
  const { ctx, horizon } = renderData

  ctx.fillStyle = 'rgb(182, 180, 97)'
  ctx.fillRect(0, 0, canvas_width, horizon)

  ctx.fillStyle = 'rgb(152, 144, 63)'
  ctx.fillRect(0, horizon, canvas_width, canvas_height - horizon)
}