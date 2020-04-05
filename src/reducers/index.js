// const 
import { emit } from '../API'
const urlParams = new URLSearchParams(window.location.search)

const defaultState = {
    game: null,
    
    id: urlParams.get('game'),
    player: +urlParams.get('player'),

    thePlayer: null,
    
    notification: null
}

const getPlayerNotification = (state, newState) => {
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

  const oldPlayer = state.thePlayer
  const newPlayer = newState.thePlayer
  if (!newPlayer || !newPlayer.current) return null
  if (newPlayer.canEnd) 
    return 'You can finish the game!'
  if (!newPlayer.canCoverWith.length && !newPlayer.canTake && !newPlayer.canEnd 
      && newPlayer.canSkip) {
    emit('skip')
    return 'No moves left, pass...'
  }
    
  if (!newPlayer.canCoverWith.length && !newPlayer.canSkip && !newPlayer.canEnd
      && newPlayer.canTake)
    return 'No moves left, take a card!'
  return 'Your turn'
}

export default  (state = defaultState, action) => {
    switch (action.type) {
      case 'UPDATE_GAME':
        const newState = {
          ...state,
          game: action.game,
          id: action.game.id,
          thePlayer: action.game && action.game.players.find(player => player.id === state.player)
        }
        const text = getPlayerNotification(state, newState)
        if (text) newState.notification = { text, id: +new Date() }
        return  newState
      case 'NOTIFICATION':
        return {
          ...state,
          notification: !action.text ? null : { text: action.text, id: +new Date() }
        }
      default:
        return state
    }
  }
  