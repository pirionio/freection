const React = require('react')
const {PropTypes} = React

const TextTruncate = require('../../UI/TextTruncate')
const Flexbox = require('../../UI/Flexbox')
const styleVars = require('../../style-vars')

const CommentPreviewText = ({comment, numOfNewComments}) => {
    const style = {
        unreadCount: {
            color: styleVars.baseGrayColor,
            marginLeft: '6px',
            fontSize: '0.9em',
            lineHeight: styleVars.previewLineHeight
        },
        textTruncate: {
            display: 'inline-block',
            width:'100%'
        }
    }

    const unreadCount = numOfNewComments > 1 ?
        <Flexbox style={style.unreadCount}>
            (+{numOfNewComments - 1})
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
    numOfNewComments: PropTypes.number
}
CommentPreviewText.defaultProps = {
    numOfNewComments: 0
}

module.exports = CommentPreviewText