export const updateGame = game => ({
  type: 'UPDATE_GAME', game
})

export const setNotification = text => ({
  type: 'NOTIFICATION', text
})

export const setConfig = (config, value) => ({
  type: 'CONFIG', config, value
})
