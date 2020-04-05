import React from 'react'
import './card.css'

const suitToChar = {
    DIAMONDS: '♦',
    CLUBS: '♣',
    HEARTS: '♥',
    SPADES: '♠',
}

export default ({ card, available, size, onClick, style}) => {
    let [ name, suit ] = card.split('_')
     
    const suitChar = suitToChar[suit]  || ''
    const shortName = name.length > 2 ? name[0] : name || ''
    
    size = size || ''
    available = available ? 'available' : ''

    return (
        <div className={`card ${name} ${suit} ${available} ${size} `} 
             onClick={onClick} style={style} >
            <div className="name">
                { [1, 2].map(i => <span key={i}>{suitChar} <br /> {shortName} </span>)}
            </div>
            
        </div>
    )
}