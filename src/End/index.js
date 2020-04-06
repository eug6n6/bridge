import React from 'react'
import { emit } from '../API'
import { connect } from 'react-redux'
import './end.css'

const End = ({ game, player }) => {
  if (!game) return null
  const winner = game.players.find(player => player.winner)
  const win = winner.id === player.id
  return (
    <div className="end">
      <h2><b>{win ? 'You' : winner.name}</b> won!</h2>

      <div className="table">
        {game.players.map((_player, i) =>
          <div key={i} className={"player " + (player.id === _player.id ? 'current' : '')}>
            <h3>{_player.name}</h3>
            {_player.points.map((points, i) =>
              <div key={i} className="points">{points}</div>
            )}
            <div className="points">Total: {_player.points.reduce((t, p) => t + p, 0)}</div>
          </div>
        )}
      </div>

      <div className="btns">
        <a href="/">Exit</a>
        <button onClick={() => emit('restart')}>Repeat</button>
      </div>

    </div>
  )

}

export default connect(({ game, player }) => ({ game, player }))(End)
