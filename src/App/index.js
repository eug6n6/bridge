import React from 'react'
import { connect } from 'react-redux'
import Header from '../Header'
import Game from '../Game'
import Start from '../Start'
import './App.css'

const App = ({ game, player }) => {
  return (
    <React.Fragment>
      <div className={'bg ' + (!game ? 'glitch' : '')} />
      <div className="App">
        <Header />
        {game && player ? <Game /> : <Start />}
      </div>
    </React.Fragment>
  )
}

export default connect(({ game, player }) => ({ game, player }))(App)
