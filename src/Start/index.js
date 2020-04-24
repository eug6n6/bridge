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
      playersNumber: 2,
      name: localStorage.getItem('name') || ''
    }
  }

  start = () => {
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

  create() {
    emit('username', this.state.name)
    localStorage.setItem('name', this.state.name)
  }

  render() {
    const { id, player, game } = this.props

    const urlParams = new URLSearchParams(window.location.search)
    if (id && !urlParams.has('game')) {
      urlParams.append('game', id)
      window.history.replaceState(null, null, '?' + urlParams.toString());
      connectAPI()
    }
    const url = window.location.href

    const namedAvailableUsers = game ? game.players.filter(player =>
      !player.online && player.name
    ) : []
    console.log(namedAvailableUsers)
    let thePlayer = null
    if (this.state.name)
      thePlayer = namedAvailableUsers.find(user => user.name === this.state.name)
    const canCreateUser = game ? game.players.some(player =>
      !player.online && !player.name
    ) : false

    return (
      <React.Fragment>
        <div className="start">
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
              <button onClick={this.start}>Start new game</button>
            </div>
          }
          {game && !player &&
            <div className="play">
              <div className="link">
                <h3>Share link with friends</h3>
                <CopyToClipboard text={url} onCopy={() => this.props.setNotification('Copied to clipboard')}>
                  <div className="url">
                    <i>{url}</i>
                    <span role="img" aria-label="copy">📋</span>
                  </div>
                </CopyToClipboard>
              </div>
              {!thePlayer && canCreateUser &&
                <div className="create">
                  <h3>Start playing</h3>
                  <div className="form">
                    <input type="text" maxLength="10" placeholder="nickname"
                      onKeyPress={({ key }) => key === 'Enter' && this.state.name && this.create()}
                      onChange={({ target }) => this.setState({ name: target.value })} value={this.state.name} />
                    <button disabled={!this.state.name} onClick={() => this.create()}>Play</button>
                  </div>
                </div>
              }
              {!!namedAvailableUsers.length &&
                <div className="btns">
                  <h3>Play as:</h3>
                  <div className="names">
                    {thePlayer
                      ? <a key={thePlayer.id} href={url + '&player=' + thePlayer.id}>{thePlayer.name}</a>
                      : namedAvailableUsers.filter(player => !player.online && player.name).map(player =>
                        <a key={player.id} href={url + '&player=' + player.id}>{player.name}</a>
                      )}
                  </div>
                </div>
              }
            </div>

          }
        </div>
        <div className="about">
          Another implementation of the old beloved card game
        </div>
      </React.Fragment>
    )
  }
}

export default connect(
  ({ id, player, game }) => ({ id, player, game }),
  { setNotification }
)(Start)
