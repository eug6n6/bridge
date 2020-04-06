import React from 'react'
import { connect } from 'react-redux'
import Header from '../Header'
import Game from '../Game'
import Start from '../Start'
import End from '../End'
import './App.css'

const App = ({ game, player }) => {
  console.log(player)
  return (
    <React.Fragment>
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
