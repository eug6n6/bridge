import React from 'react'
import { connect } from 'react-redux'
import './notification.css'


const Notification = ({ notifications }) => {
    return (
        <div className="notifications-wrapper">
            {notifications.map((notification, i) =>
                <div className="notification" key={notification.id}>
                    {notification.text}
                </div>
            )}
        </div>
    )

}
export default connect(
    ({ notifications }) => ({ notifications })
)(Notification)