import React from 'react'
import { connect } from 'react-redux'
import { emit } from '../API'
import './end.css'

const End = ({ game }) => {
  if (!game) return null
  const winner = game.players.find(player => player.winner)

  return (
    <div className="end">
      <h2><b>{winner.name}</b> wins!</h2>

      <div className="table">
        {game.players.map(player =>
          <div key={player.id} className="player">
            <h3>{player.name}</h3>
            <div className="points">{player.points}</div>
          </div>
        )}
      </div>


      <div>
        <a href="/">Repeat</a>
      </div>

    </div>
  )

}

export default connect(({ game }) => ({ game }))(End)
