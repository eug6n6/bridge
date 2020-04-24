import React from 'react'
import Info from '../Info'
import Configs from '../Configs'
import './header.css'

export default class Header extends React.Component {

    state = {
        info: false,
        configs: false
    }

    render() {
        return (
            <React.Fragment>
                <header className={this.props.glow ? 'glow' : ''}>
                    <a href="/"><h1>Bridge</h1></a>
                    <button onClick={() => this.setState({ info: true })}>i</button>
                    <button onClick={() => this.setState({ configs: true })}>⚙</button>
                </header>
                <Info show={this.state.info} close={() => this.setState({ info: false })} />
                <Configs show={this.state.configs} close={() => this.setState({ configs: false })} />
            </React.Fragment>
        )
    }
}