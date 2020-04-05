import React from 'react'
import { connect } from 'react-redux'
import { setNotification } from '../actions'
import './notification.css'

const DISPLAY_DURATION = 2 * 1000
let TO = null

const Notification = ({ notification, setNotification }) => {
  console.log(notification)
    if (!notification) return null
    clearTimeout(TO)
    TO = setTimeout(() => setNotification(null), DISPLAY_DURATION)
    return (
        <div className="notification">
            <div className="box">
                { notification.text }
            </div>
        </div>
    )
   
}
export default connect(
    ({ notification }) => ({ notification }),
    { setNotification }
)(Notification)