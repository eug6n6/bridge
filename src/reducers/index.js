
const urlParams = new URLSearchParams(window.location.search)

const defaultState = {
    game: null,
    
    id: urlParams.get('game'),
    player: +urlParams.get('player'),

    thePlayer: null,
    
    notification: null
}

const getPlayerNotification = (state, newState) => {
  const oldPlayer = state.thePlayer
  const newPlayer = newState.thePlayer
  if (!newPlayer || !newPlayer.current) return null
  if (newPlayer.canEnd) 
    return 'You can finish the game!'
  if (!newPlayer.canCoverWith.length && !newPlayer.canTake && !newPlayer.canEnd 
      && newPlayer.canSkip)
      // TODO send skip
    return 'No moves left, pass...'
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
  