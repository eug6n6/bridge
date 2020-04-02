
const urlParams = new URLSearchParams(window.location.search)

const defaultState = {
    game: null,
    id: urlParams.get('game'),
    player: +urlParams.get('player')
}

export default  (state = defaultState, action) => {
    switch (action.type) {
      case 'UPDATE_GAME':
        return {
          ...state,
          game: action.game,
          id: action.game.id
        }
      default:
        return state
    }
  }
  