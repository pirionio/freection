const React = require('react')
const {PropTypes} = React

const TextTruncate = require('../../UI/TextTruncate')
const Flexbox = require('../../UI/Flexbox')
const styleVars = require('../../style-vars')
const commentImage = require('../../../static/comment-square.png')

const CommentPreviewText = ({comment, newNotifications}) => {
    const style = {
        icon: {
            lineHeight: styleVars.previewLineHeight,
            marginRight: '12px'
        },
        unreadCount: {
            color: styleVars.baseGrayColor,
            marginLeft: '6px',
            fontSize: '0.9em',
            lineHeight: styleVars.previewLineHeight
        },
        textTruncate: {
            display: 'inline-block',
            width:'100%',
            lineHeight: styleVars.previewLineHeight
        }
    }

    const unreadCount = newNotifications.length > 1 ?
        <Flexbox style={style.unreadCount}>
            (+{newNotifications.length - 1})
        </Flexbox> : null

    return (
        <Flexbox container={true}>
            <Flexbox style={{minWidth: 0}}>
                <TextTruncate style={style.textTruncate}>{comment}</TextTruncate>
            </Flexbox>
            { unreadCount }
        </Flexbox>
    )
}

CommentPreviewText.propTypes = {
    comment: PropTypes.string.isRequired,
    newNotifications: PropTypes.array
}
CommentPreviewText.defaultProps = {
    newNotifications: []
}

module.exports = CommentPreviewText