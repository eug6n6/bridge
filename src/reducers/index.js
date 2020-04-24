import { emit } from '../API'

const defaultState = {
  game: null,
  player: null,
  notifications: [],
  configs: {
    'soundOff': +localStorage.getItem('soundOff') === 1,
    'hintsOff': +localStorage.getItem('hintsOff') === 1,
    'backgroundPattern': +localStorage.getItem('backgroundPattern')
      || 1 + Math.floor(Math.random() * 10)
  }
}

const becomesCurrent = (oldPlayer, newPlayer) => {
  if (!newPlayer) return false
  return (!oldPlayer || !oldPlayer.current) && newPlayer.current
}

const getNotificationText = (state, newState) => {

  if (newState.game && newState.game.ended) {
    if (state.game && !state.game.ended) return 'Bridge!'
    return
  }

  if (state.game && state.game.players && newState.game && newState.game.players) {
    const playerIsOnline = newState.game.players
      .find((player, i) => player.online && !state.game.players[i].online)
    if (playerIsOnline) return `${playerIsOnline.name} is online`
    const playerIsOffline = newState.game.players
      .find((player, i) => !player.online && state.game.players[i].online)
    if (playerIsOffline) return `${playerIsOffline.name} is offline`
  }

  const newPlayer = newState.player
  if (!newPlayer) return null
  if (!newPlayer.current) {
    if (state.player && newPlayer.skip > state.player.skip)
      return 'You skip'
    return null
  }
  if (newPlayer.canEnd) {
    if (!newPlayer.cards.length) emit('end')
    return 'You can finish the game!'
  }
  if (!newPlayer.canCoverWith.length && !newPlayer.canTake
    && !newPlayer.canEnd && newPlayer.canSkip) {
    emit('skip')
    return
  }
  if (becomesCurrent(state.player, newPlayer)) {
    if (!state.configs.soundOff)
      new Audio('/sound.ogg').play()
    return 'Your turn!'
  }
}

const addNotification = (state, text) => {
  const notifications = [
    { text: text, id: +new Date() },
    ...state.notifications
  ]
  if (notifications.length > 5) notifications.pop()
  return notifications
}

export default (state = defaultState, action) => {
  switch (action.type) {
    case 'UPDATE_GAME':
      const newState = {
        ...state,
        game: action.game,
        id: action.game.id,
        player: action.game.player
      }
      const text = getNotificationText(state, newState)
      if (text) newState.notifications = addNotification(state, text)
      becomesCurrent(state.player, newState.player)
      return newState
    case 'NOTIFICATION':
      return { ...state, notifications: addNotification(state, action.text) }
    case 'CONFIG':
      localStorage.setItem(action.config, +action.value)
      return {
        ...state, configs: {
          ...state.configs,
          [action.config]: action.value
        }
      }
    default:
      return state
  }
}
