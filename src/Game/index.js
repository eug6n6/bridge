import React from 'react'
import { connect } from 'react-redux'
import { emit } from '../API'
import Deck from '../Deck'
import Pile from '../Pile'
import ThePlayer from '../ThePlayer'
import End from '../End'
import './Game.css'




const Game = ({ game, thePlayer }) => {

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
              <h5>
                <small>{player.online ? '🟢' : '🔴'} </small> {player.name}
              </h5>
              { player !== thePlayer &&
                  <div className="card xs unknown"> 
                    <div className="cards-number">{player.cards.length}</div>
                  </div>
              }
            </div>
          )}
        </div>
      </div>
      { thePlayer && <ThePlayer /> }
    </div>
  )

}

export default connect(({ game, thePlayer }) => ({ game, thePlayer }))(Game)
