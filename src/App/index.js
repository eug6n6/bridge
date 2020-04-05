import React from 'react'
import { connect } from 'react-redux'
import Header from '../Header'
import Game from '../Game'
import Start from '../Start'
import End from '../End'
import './App.css'

const App = ({ game, thePlayer }) => {
  return (
    <React.Fragment>
      <div className={'bg ' + (!game ? 'glitch' : '')} />
      <div className="App">
        <Header glow={game} />
        {game && thePlayer && !game.ended && <Game />}
        {game && thePlayer && game.ended && <End />}
        {(!game || !thePlayer) && <Start />}
      </div>
    </React.Fragment>
  )
}

export default connect(({ game, thePlayer }) => ({ game, thePlayer }))(App)
