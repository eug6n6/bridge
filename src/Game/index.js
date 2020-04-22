import React from 'react'
import { connect } from 'react-redux'
import { emit } from '../API'
import Deck from '../Deck'
import Pile from '../Pile'
import ThePlayer from '../ThePlayer'
import './Game.css'

const Game = ({ game, player }) => {

  return (
    <div className="game">
      <div className="table">
        <Deck length={game.deck}
          onClick={() => emit('take')}
          available={player && player.current && player.canTake} />
        <Pile cards={game.pile} />
      </div>

      <div className="players">
        <div className="players-wrapper">
          {game.players.map(_player =>
            <div key={_player.id} className={'player ' + (_player.current ? 'current ' : '') + (player.id === _player.id ? 'the' : '')}>
              <div>
                <span role="img" className="online">{_player.online ? '🟢' : '🔴'} </span> {_player.name}
              </div>
              {_player.id !== player.id &&
                <div className="card xs unknown">
                  <div className="cards-number">{_player.cards}</div>
                </div>
              }
            </div>
          )}
        </div>
      </div>
      {player && <ThePlayer />}
    </div>
  )

}

export default connect(({ game, player }) => ({ game, player }))(Game)
