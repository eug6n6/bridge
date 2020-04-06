import React from 'react'
import { connect } from 'react-redux'
import './notification.css'


const Notification = ({ notifications }) => {
    return (
        <React.Fragment>
            <div className="notification">
                {notifications.map(notification =>
                    <div className="box" key={notification.id}>
                        {notification.text}
                    </div>
                )}
            </div>
        </React.Fragment>
    )

}
export default connect(
    ({ notifications }) => ({ notifications })
)(Notification)