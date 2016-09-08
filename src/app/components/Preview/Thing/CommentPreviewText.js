import React, {PropTypes} from 'react'
import useSheet from 'react-jss'

import TextTruncate from '../../UI/TextTruncate'
import Flexbox from '../../UI/Flexbox'
import styleVars from '../../style-vars'

const CommentPreviewText = ({comment, newNotifications, sheet: {classes}}) => {
    const unreadCount = newNotifications.length > 1 ?
        <Flexbox className={classes.unreadCount}>
            (+{newNotifications.length - 1})
        </Flexbox> : null

    return (
        <Flexbox container="row" alignItems="center">
            <Flexbox className={classes.textRow}>
                <TextTruncate className={classes.textTruncate}>{comment}</TextTruncate>
            </Flexbox>
            { unreadCount }
        </Flexbox>
    )
}

const style = {
    unreadCount: {
        color: styleVars.baseGrayColor,
        marginLeft: 6,
        fontSize: '0.85em'
    },
    textRow: {
        minWidth: 0
    },
    textTruncate: {
        display: 'inline-block',
        width:'100%'
    }
}

CommentPreviewText.propTypes = {
    comment: PropTypes.string,
    newNotifications: PropTypes.array
}
CommentPreviewText.defaultProps = {
    newNotifications: []
}

export default useSheet(CommentPreviewText, style)