import React from 'react'
import { connect } from 'react-redux'
import { emit } from '../API'
import './end.css'

const Game = ({ game }) => {

  const winner = game.players.find(player => player.winner)
  console.log(winner)

  return (
    <div className="modal">
      <div className="content">
        {winner && <h2>{winner.name} wins!</h2>}
        <div className="points-table">
          {game.players.map(player =>
            <div className="points">{player.name} - {player.points}</div>
          )}
        </div>
        <div>
          <a href="/">Repeat</a>
        </div>
      </div>

    </div>
  )

}

export default connect(({ game }) => ({ game }))(Game)
