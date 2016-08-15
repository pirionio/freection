const React = require('react')
const {PropTypes} = React

const TextTruncate = require('../../UI/TextTruncate')
const Flexbox = require('../../UI/Flexbox')
const styleVars = require('../../style-vars')
const commentImage = require('../../../static/comment-square.png')

const CommentPreviewText = ({comment, numOfNewComments}) => {
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

    const unreadCount = numOfNewComments > 1 ?
        <Flexbox style={style.unreadCount}>
            (+{numOfNewComments - 1})
        </Flexbox> : null

    return (
        <Flexbox container={true}>
            <Flexbox style={style.icon} container="column" justifyContent="center">
                <img src={commentImage} />
            </Flexbox>
            <Flexbox style={{minWidth: 0}}>
                <TextTruncate style={style.textTruncate}>{comment}</TextTruncate>
            </Flexbox>
            { unreadCount }
        </Flexbox>
    )
}

CommentPreviewText.propTypes = {
    comment: PropTypes.string.isRequired,
    numOfNewComments: PropTypes.number
}
CommentPreviewText.defaultProps = {
    numOfNewComments: 0
}

module.exports = CommentPreviewText