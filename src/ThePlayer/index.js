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
      <div className="cards">
        <div className="cards-wrapper">
            {player.canSkip &&
              <div className="card pass sm available"
                   onClick={() => emit('skip')}>
                     <span>Pass</span>
              </div>
            }
            {player.canEnd &&
              <div className="card bridge sm available"
                   onClick={() => emit('end')}>
                      <span>Bridge!</span>
              </div>
            }
          {player.cards.sort(card1 => player.canCoverWith && player.canCoverWith.includes(card1) ? -1 : 1).map(card =>
            <Card card={card} 
                  onClick={() => player.current && player.canCoverWith.includes(card) && attack(card)}
                  available={player.current && player.canCoverWith.includes(card)} 
                  size={player.current ? 'sm' : 'xs'}
            />
          )}
        </div>
      </div>
    </div>
  )
}
export default connect(({ game, player }) => ({ game, playerId: player }))(ThePlayer)