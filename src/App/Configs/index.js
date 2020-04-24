import React from 'react'
import { connect } from 'react-redux'
import { setConfig } from '../../actions'

const Configs = ({ show, close, configs, setConfig }) => {

    const disableHints = () => <style>{`
        .card.available {
            animation: none
        }
    `}</style>

    return (
        <React.Fragment>
            {configs.hintsOff && disableHints()}
            {show &&
                <div className="modal">
                    <div className="content">
                        <button onClick={close} className="close">×</button>
                        <h2>Configs</h2>
                        {configs.soundOff
                            ? <div className="config off" onClick={() => setConfig('soundOff', false)}>Sound disabled</div>
                            : <div className="config on" onClick={() => setConfig('soundOff', true)}>Sound enabled</div>
                        }
                        {configs.hintsOff
                            ? <div className="config off" onClick={() => setConfig('hintsOff', false)}>Hints disabled</div>
                            : <div className="config on" onClick={() => setConfig('hintsOff', true)}>Hints enabled</div>
                        }
                        <h4>Background</h4>
                        <div className="background-config">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i =>
                                <div key={i}
                                    className={'bg-sample pattern' + i + (configs.backgroundPattern === i ? ' selected' : '')}
                                    onClick={() => setConfig('backgroundPattern', i)}
                                />
                            )}
                        </div>
                    </div>
                </div>
            }
        </React.Fragment>
    )

}


export default connect(
    ({ configs }) => ({ configs }),
    { setConfig }
)(Configs)