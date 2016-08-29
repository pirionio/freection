const React = require('react')
const {PropTypes} = React

const TextTruncate = require('../../UI/TextTruncate')
const Flexbox = require('../../UI/Flexbox')
const styleVars = require('../../style-vars')

const CommentPreviewText = ({comment, newNotifications}) => {
    const style = {
        unreadCount: {
            color: styleVars.baseGrayColor,
            marginLeft: '6px',
            fontSize: '0.85em'
        },
        textTruncate: {
            display: 'inline-block',
            width:'100%'
        }
    }

    const unreadCount = newNotifications.length > 1 ?
        <Flexbox style={style.unreadCount}>
            (+{newNotifications.length - 1})
        </Flexbox> : null

    return (
        <Flexbox container="row" alignItems="center">
            <Flexbox style={{minWidth: 0}}>
                <TextTruncate style={style.textTruncate}>{comment}</TextTruncate>
            </Flexbox>
            { unreadCount }
        </Flexbox>
    )
}

CommentPreviewText.propTypes = {
    comment: PropTypes.string,
    newNotifications: PropTypes.array
}
CommentPreviewText.defaultProps = {
    newNotifications: []
}

module.exports = CommentPreviewText