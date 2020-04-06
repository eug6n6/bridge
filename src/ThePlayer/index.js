/* eslint-disable jsx-a11y/accessible-emoji */
import React from 'react'
import { connect } from 'react-redux'
import { emit } from '../API'
import Card from '../Card'
import './player.css'

const Sticker = ({ children, playerName}) => {
  return (
    <span role="img" onClick={() => emit('notification', `${playerName}: ${children}`)}>{children}</span>
  )
}

const ThePlayer = ({ player }) => {

  const attack = card => emit('attack', card)

  // if (player.current && !localStorage.getItem('soundOff')) 
  //   new Audio('/sound.ogg').play()

  return (
    <div className={'the-player ' + (player.current ? 'current' : '')}>
      <div className="cards">
        <div className="cards-wrapper">
          {player.canEnd &&
            <div className="card bridge sm available"
              onClick={() => emit('end')}>
              <span>Bridge!</span>
            </div>
          }
          {player.canSkip &&
            <div className="card pass sm available"
              onClick={() => emit('skip')}>
              <span>Pass</span>
            </div>
          }
          {player.cards
            .map((card, i) =>
              <Card 
                key={i}
                card={card}
                onClick={() => player.current && player.canCoverWith.includes(card) && attack(card)}
                available={player.current && player.canCoverWith.includes(card)}
                size={player.current ? 'sm' : 'xs'}
              />
            )}
        </div>
      </div>

      <div className="emojis">
        <Sticker playerName={player.name}>✋</Sticker>
        <Sticker playerName={player.name}>🤨</Sticker>
        <Sticker playerName={player.name}>😁</Sticker>
        <Sticker playerName={player.name}>🙃</Sticker>
        <Sticker playerName={player.name}>😗</Sticker>
        <Sticker playerName={player.name}>😩</Sticker>
        <Sticker playerName={player.name}>😢</Sticker>
        <Sticker playerName={player.name}>🤮</Sticker>
        <Sticker playerName={player.name}>👍🏽</Sticker>
        <Sticker playerName={player.name}>👎🏽</Sticker>
        <Sticker playerName={player.name}>🖕🏻</Sticker>
        <Sticker playerName={player.name}>🤝</Sticker>
      </div>


    </div>
  )
}
export default connect(({ game, player }) => ({ game, player }))(ThePlayer)