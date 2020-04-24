import React from 'react'
import './card.css'

const suitToChar = {
    DIAMONDS: '♦',
    CLUBS: '♣',
    HEARTS: '♥',
    SPADES: '♠',
}

const nameValues = {
    '6': 0,
    '7': 7,
    '8': 8,
    '9': 9,
    '10': 10,
    'JACK': 11,
    'QUEEN': 12,
    'KING': 13,
    'ACE': 14
}

export function sort(c1, c2) {
    return nameValues[c1.split('_')[0]] - nameValues[c2.split('_')[0]]
}

export default ({ card, available, size, onClick, style, className}) => {
    let [ name, suit ] = card.split('_')
     
    const suitChar = suitToChar[suit]  || ''
    const shortName = name.length > 2 ? name[0] : name || ''
    
    size = size || ''
    className = className || ''
    available = available ? 'available' : ''

    return (
        <div className={`card ${name} ${suit} ${available} ${size} ${className}`} 
             onClick={onClick} style={style} >
            <div className="name">
                { [1, 2].map(i => <span key={i}>{suitChar} <br /> {shortName} </span>)}
            </div>
            
        </div>
    )
}