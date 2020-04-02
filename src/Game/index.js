import React from 'react'
import { connect } from 'react-redux'
import { emit } from '../API'
import Deck from '../Deck'
import Pile from '../Pile'
import ThePlayer from '../ThePlayer'
import End from '../End'
import './Game.css'




const Game = ({ game, playerId }) => {

  const thePlayer = game.players.find(player => player.id === playerId)
  console.log(thePlayer)

  return (
    <div className="game">
      <div className="table">
        <Deck length={game.deck}
          onClick={() => emit('take')}
          available={thePlayer && thePlayer.current && thePlayer.canTake} />
        <Pile cards={game.pile} />
      </div>

      <div className="players">
        <div className="players-wrapper">
          {game.players.map(player =>
            <div className={'player ' + (player.current ? 'current ' : '') + (player === thePlayer ? 'the' : '')}>
              <h5>{player.online ? '🟢' : '🔴'} {player.name}</h5>
              <div className="card unknown" />
              <div className="cards-number">{player.cards.length}</div>
            </div>
          )}
        </div>
      </div>
      <ThePlayer />
      {game && game.ended && <End />}
    </div>
  )

}

export default connect(({ game, player }) => ({ game, playerId: player }))(Game)
