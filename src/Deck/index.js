import React from 'react'
import './deck.css'

export default props => {
    const getPadding = i => i * 0.1 + (0.1 * Math.random()) + 'rem'

    return (
        <div className={"deck " + (props.available ? 'available' : '')}
            onClick={() => props.available && props.onClick()}>
            <div className="cards">
                {Array.from(Array(props.length > 5 ? 5 : props.length), (_, i) =>
                    <div className="card unknown" style={{ left: getPadding(i), top: getPadding(i / 2) }} />
                )}
            </div>

        </div>
    )
}