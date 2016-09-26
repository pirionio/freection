import React, {PropTypes} from 'react'
import useSheet from 'react-jss'

import Flexbox from '../../UI/Flexbox'
import styleVars from '../../style-vars'

const MentionPreviewText = ({comment, newNotifications, sheet: {classes}}) => {
    const unreadCount = newNotifications.length > 1 ?
        <Flexbox className={classes.unreadCount}>
            (+{newNotifications.length - 1})
        </Flexbox> : null

    return (
        <Flexbox container="row" alignItems="center">
            <Flexbox className={classes.text}>
                {comment}
            </Flexbox>
            {unreadCount}
        </Flexbox>
    )
}

const style = {
    unreadCount: {
        color: styleVars.baseGrayColor,
        marginLeft: 6,
        fontSize: '0.85em'
    },
    text: {
        display: 'inline-block'
    }
}

MentionPreviewText.propTypes = {
    comment: PropTypes.string.isRequired,
    newNotifications: PropTypes.array
}
MentionPreviewText.defaultProps = {
    newNotifications: []
}

export default useSheet(MentionPreviewText, style)