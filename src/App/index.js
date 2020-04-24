import React from 'react'
import { connect } from 'react-redux'
import Header from './Header'
import Game from '../Game'
import Start from '../Start'
import End from '../End'
import './App.css'

class App extends React.Component {

  constructor(props) {
    super(props)
    this.setBodyClass(props.configs.backgroundPattern)
  }

  componentDidUpdate(prevProps) {
    if (prevProps.configs.backgroundPattern !== this.props.configs.backgroundPattern)
    this.setBodyClass(this.props.configs.backgroundPattern)
  }

  setBodyClass(i) {
    document.body.classList = 'pattern' + i

  }

  render() {
    const { game, player } = this.props
    return (
      <React.Fragment>
        <div className="App">
          <Header glow={!game} />
          {game && player && !game.ended && <Game />}
          {game && player && game.ended && <End />}
          {(!game || !player) && <Start />}
        </div>
        <div className="loader" />
      </React.Fragment>
    )
  }
}

export default connect(({ game, player, configs }) => ({ game, player, configs }))(App)
