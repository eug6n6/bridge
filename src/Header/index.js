import React from 'react'
import './header.css'

export default class Hedaer extends React.Component {

    state = {
        info: false
    }

    render() {
        return (
            <React.Fragment>
                <header>
                    <a href="/"><h1>Bridge</h1></a>
                    <button className="i" onClick={() => this.setState({ info: true })}>i</button>
                </header>
                {this.state.info &&
                    <div className="modal" onClick={() => this.setState({ info: false })}>
                        <div className="content">
                            <h2>Rules</h2>
                            <div className="rule">
                                <span className="red">6♥ </span>
                                <span className="red">6♦ </span>
                                <span>6♣ </span>
                                <span>6♠ </span>
                                 - must be covered with other card by the player
                            </div>
                            <div className="rule">
                                <span className="red">8♥ </span>
                                <span className="red">8♦ </span>
                                <span>8♣ </span>
                                <span>8♠ </span>
                                 - next player takes 1 card
                            </div>
                            <div className="rule">
                                <span className="red">9♥ </span>
                                <span className="red">9♦ </span>
                                <span>9♣ </span>
                                <span>9♠ </span>
                                 - next player takes 2 cards and skip their turn
                            </div>
                            <div className="rule">
                                <span className="red">J♥ </span>
                                <span className="red">J♦ </span>
                                <span>J♣ </span>
                                <span>J♠ </span>
                                 - can cover any other card
                            </div>
                            <div className="rule">
                                <span className="red">K♥</span> - next player takes 5 cards
                            </div>
                            <div className="rule">
                                <span className="red">A♥ </span>
                                <span className="red">A♦ </span>
                                <span>A♣ </span>
                                <span>A♠ </span>
                                 - next player skips their turn
                            </div>
                            <h3>Not implemented rules</h3>
                            <div className="rule">
                                <span className="red">J♥ </span>
                                <span className="red">J♦ </span>
                                <span>J♣ </span>
                                <span>J♠ </span>
                                 - can cover any other card and the player can choose next card suit
                            </div>
                        </div>
                    </div>
                }
            </React.Fragment>
        )
    }
}