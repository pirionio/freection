import React, {PropTypes} from 'react'
import useSheet from 'react-jss'

import Flexbox from '../../UI/Flexbox'
import styleVars from '../../style-vars'

const PingPreviewText = ({newNotifications, sheet: {classes}}) => {
    const unreadCount = newNotifications.length > 1 ?
        <Flexbox className={classes.unreadCount}>
            (+{newNotifications.length - 1})
        </Flexbox> : null

    return (
        <Flexbox container="row" alignItems="center">
            <Flexbox className={classes.text}>
               Ping!
            </Flexbox>
            {unreadCount}
        </Flexbox>
    )
}

const style = {
    unreadCount: {
        color: styleVars.greyTextColor,
        marginLeft: 6,
        fontSize: '0.85em'
    },
    text: {
        display: 'inline-block'
    }
}

PingPreviewText.propTypes = {
    newNotifications: PropTypes.array
}
PingPreviewText.defaultProps = {
    newNotifications: []
}

export default useSheet(PingPreviewText, style)