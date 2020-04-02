import openSocket from 'socket.io-client'
import { updateGame } from './actions'
import store from './store'

const urlParams = new URLSearchParams(window.location.search)
const params = {
  game: urlParams.get('game'),
  player: urlParams.get('player')
}

let socket = null

const URL = '//localhost:4020'


const getUrl = (URL, { game, player }) => {
  if (game) {
    URL += '?game=' + game
    if (player)
      URL += '&player=' + player
  }
  return URL
}

const connect = () => {
  socket = openSocket(getUrl(URL, params))
  socket.on('invalid', console.error)
  socket.on('state', state => {
    console.log(state)
    store.dispatch(updateGame(state))
  })
  socket.on('started', state => {
    console.log(state)
    store.dispatch(updateGame(state))
  })
}

const emit = (event, data) => {
  if (socket)
    socket.emit(event, data)
}

export { emit, connect, params }