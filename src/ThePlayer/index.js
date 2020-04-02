import React from 'react'
import { connect } from 'react-redux'
import { emit } from '../API'
import Card from '../Card'
import './player.css'

const ThePlayer = ({ game, playerId }) => {
  console.log(playerId)
  const player = game.players.find(player => playerId === player.id)
  if (!player) return null


  const attack = card => emit('attack', card)

  return (
    <div className={'the-player ' + (player.current ? 'current' : '')}>
      {player.current &&
        <div className="control">
          <div className="help">
            {player && player.canCoverWith && !!player.canCoverWith.length &&
              <div> Your turn! </div>}
            {!player.canCoverWith.length && player.canSkip
              && !player.canTake && !player.canEnd &&
              <div>No moves left, continue...</div>}
            {!player.canCoverWith.length && !player.canSkip
              && player.canTake && !player.canEnd &&
              <div>No moves left, take a card!</div>}
            {player.canEnd &&
              <div>You can finish the game!</div>}
          </div>
          <div className="actions">
            {player.canEnd &&
              <button className="red"
                onClick={() => emit('end')}>Bridge!
              </button>
            }
            {player.canSkip &&
              <button
                onClick={() => emit('skip')}>Continue...</button>
            }

          </div>
        </div>
      }

      <div className="cards">
        <div className="cards-wrapper">
          {player.cards.map(card =>
            <Card card={card} onClick={() => player.current && player.canCoverWith.includes(card) && attack(card)}
              available={player.current && player.canCoverWith.includes(card)} />
          )}
        </div>
      </div>
    </div>
  )
}
export default connect(({ game, player }) => ({ game, playerId: player }))(ThePlayer)