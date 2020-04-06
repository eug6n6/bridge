import React from 'react'
import { connect } from 'react-redux'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { emit, connect as connectAPI } from '../API'
import { setNotification } from '../actions'
import './start.css'

class Start extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      playersNumber: 2
    }
  }

  create = () => {
    emit('start', this.state.playersNumber)
  }

  inc = () => {
    if (this.state.playersNumber >= 6) return
    this.setState({ playersNumber: this.state.playersNumber + 1 })
  }
  dec = () => {
    if (this.state.playersNumber <= 2) return
    this.setState({ playersNumber: this.state.playersNumber - 1 })
  }

  render() {
    const { id, player, game } = this.props

    const urlParams = new URLSearchParams(window.location.search)
    if ( id && !urlParams.has('game')) {
      urlParams.append('game', id)
      window.history.replaceState(null, null, '?' + urlParams.toString());
      connectAPI()
    }
    const url = window.location.href
    
    return (
      <React.Fragment>
        <div className="start">
          <div className="about">
            Another implementation of the old beloved card game
        </div>
          {!game &&
            <div className="new">
              <div className="players">
                <h3>Players number:</h3>
                <div className="edit">
                  <button onClick={this.dec}>-</button>
                  <span>{this.state.playersNumber}</span>
                  <button onClick={this.inc}>+</button>
                </div>
              </div>
              <button onClick={this.create}>Start new game</button>
            </div>
          }
          {game && !player &&
            <div className="play">
              <div className="link">
                <h2>Share link with friends:</h2>
                <CopyToClipboard text={url} onCopy={() => this.props.setNotification('Copied to clipboard')}>
                  <div className="url">{url} <span role="img" aria-label="copy">📋</span></div>
                </CopyToClipboard>
              </div>
              <div className="btns">
                <h2>Play as:</h2>
                <div className="names">
                  { game.players.filter(player => !player.online).map(player =>
                    <a key={player.id} href={url + '&player=' + player.id}>{player.name}</a>                  
                  )}
                </div>
              </div>
            </div>
          }
        </div>
      </React.Fragment>
    )
  }
}

export default connect(
  ({ id, player, game }) => ({ id, player, game }),
  { setNotification }
)(Start)
