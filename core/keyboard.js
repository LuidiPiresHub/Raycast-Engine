export const keysMap = {
  'KeyW': false,
  'KeyA': false,
  'KeyS': false,
  'KeyD': false,
  'ArrowUp': false,
  'ArrowLeft': false,
  'ArrowDown': false,
  'ArrowRight': false,
  'ShiftLeft': false,
  'ControlLeft': false,
  'KeyC': false,
  'Space': false,
}

export const updateKeysState = ({ code, type }) => {
  if (!(code in keysMap)) return
  keysMap[code] = type === 'keydown'
}