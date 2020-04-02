import React from 'react'

export default props => {
    let [ name, suit ] = props.card.split('_')
     
    const d = {
        DIAMONDS: '♦',
        CLUBS: '♣',
        HEARTS: '♥',
        SPADES: '♠',
    }[suit] 
    const n = name.length > 2 ? name[0] : name

    return (
        <div className={`card ${name || ''} ${suit || ''} ${props.available ? 'available' : ''}`} onClick={props.onClick} style={props.style}>
            <div className="name">
                <span>{d} <br /> {n} </span>
                <span>{d} <br /> {n} </span>
            </div>
            
        </div>
    )
}