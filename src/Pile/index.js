import React from 'react'
import Card from '../Card'
import './pile.css'

export default props => {
    const getPadding = (i, length) => length - 4 > i ? (0.1 * i + 'rem') : ((i - (length - 5)) * 2 + 'rem')

    const cards = [...props.cards,...props.cards,...props.cards,]
    
    return (
        <div className="pile">
            { props.cards.map((card, i) =>
                <Card card={card} key={i} style={{ left: getPadding(i, props.cards.length) }} />
            )}
        </div>
    )
}