import React from 'react'
import Card from '../Card'
import './pile.css'

export default props => {
    const { cards } = props
    const last = cards.slice(-5)
    const hidden = cards.slice(-10, -5)

    return (
        <div className="pile">
            {hidden.map((card, i) =>
                <div key={i} className="card under" style={{ marginRight: i === hidden.length - 1 ? '-0.5rem' : '0.5rem' }} />
            )}
            {last.map((card, i) =>
                <Card card={card} key={i} className={"covered"} />
            )}
        </div>
    )
}