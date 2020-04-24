import React from 'react'
import './deck.css'

export default props => {
    
    return (
        <div className="deck"
            onClick={() => props.available && props.onClick()}>
            <div className="card unknown under-1"></div>
            <div className="card unknown under-2"></div>
            <div className="card unknown under-3"></div>
            <div className="card unknown under-4"></div>
            <div className={"card unknown " + (props.available ? 'available' : '')}></div>
        </div>
    )
}