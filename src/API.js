import openSocket from 'socket.io-client'
import { updateGame, setNotification } from './actions'
import store from './store'


let socket = null

// Dev
const URL = '//localhost:4020'

// Prod
// const URL = '/'

const connect = () => {
  const urlParams = new URLSearchParams(window.location.search)
  socket = openSocket(URL + '?' + urlParams.toString())
  socket.on('invalid', console.error)
  socket.on('redirect_to_game', ({ gameId, playerId }) => {
    const params =  new URLSearchParams()
    params.set('game', gameId)
    params.set('player', playerId)
    window.location.search = '?' + params
  })
  socket.on('state', state => {
    store.dispatch(updateGame(state))
  })
  socket.on('started', state => {
    store.dispatch(updateGame(state))
  })
  socket.on('notification', text => {
    store.dispatch(setNotification(text))
  })
  socket.on('req_error', error => {
    const urlParams = new URLSearchParams(window.location.search)
    if (error === 'player not found')
      urlParams.delete('player')
    if (error === 'game not found') {
      urlParams.delete('game')
      urlParams.delete('player')
      window.location.search = '?' + urlParams
    }
      
  })
}

const emit = (event, data = {}) => {
  if (socket)
    socket.emit(event, data)
}

export { emit, connect }