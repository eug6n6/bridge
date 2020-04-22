import React from 'react'
import { connect } from 'react-redux'
import Header from '../Header'
import Game from '../Game'
import Start from '../Start'
import End from '../End'
import './App.css'

const BG_NUMBER = 12
const getRandomBgStyle = () => {
  return `
    .bg {
      background-image: url("/bg/bridge (${1 + Math.floor(Math.random() * BG_NUMBER)}).jpg")
    }
  `
}
const randomBgStyle = getRandomBgStyle()

const App = ({ game, player }) => {
  game && console.log('pile: ' + game.pile + ', deck: ' + game.deck)
  
  return (
    <React.Fragment>
      <style>{randomBgStyle}</style>
      <div className={'bg ' + (!game ? 'glitch' : '')} />
      <div className="App">
        <Header glow={game} />
        {game && player && !game.ended && <Game />}
        {game && player && game.ended && <End />}
        {(!game || !player) && <Start />}
      </div>
      <div className="loader" />
    </React.Fragment>
  )
}

export default connect(({ game, player }) => ({ game, player }))(App)
