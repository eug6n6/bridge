import openSocket from 'socket.io-client'
import { updateGame, setNotification } from './actions'
import store from './store'


let socket = null

const URL = '//localhost:4020'
// const URL = '/'

const connect = () => {
  const urlParams = new URLSearchParams(window.location.search)
  socket = openSocket(URL + '?' + urlParams.toString())
  socket.on('invalid', console.error)
  socket.on('state', state => {
    console.log(state)
    store.dispatch(updateGame(state))
  })
  socket.on('started', state => {
    console.log(state)
    store.dispatch(updateGame(state))
  })
  socket.on('req_error', error => {
    const urlParams = new URLSearchParams(window.location.search)
    if (error === 'player not found')
      urlParams.delete('player')
    if (error === 'game not found')
      urlParams.delete('game')
      window.location.search = '?' + urlParams
  })
}

const emit = (event, data) => {
  if (socket)
    socket.emit(event, data)
}

export { emit, connect }