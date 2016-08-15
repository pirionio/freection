const React = require('react')
const {PropTypes} = React
const Flexbox = require('../../UI/Flexbox')
const TextTruncate = require('../../UI/TextTruncate')
const styleVars = require('../../style-vars')
const commentImage = require('../../../static/comment-square.png')

const BodyPreviewText = ({body}) => {
    const style = {
        icon: {
            lineHeight: styleVars.previewLineHeight,
            marginRight: '12px'
        },
        textTruncate: {
            lineHeight: styleVars.previewLineHeight
        }
    }

    if (body) {
        return (
            <Flexbox container={true}>
                <Flexbox style={style.icon} container="column" justifyContent="center">
                    <img src={commentImage}/>
                </Flexbox>
                <Flexbox style={{minWidth: 0}}>
                    <TextTruncate style={style.textTruncate}>{body}</TextTruncate>
                </Flexbox>
            </Flexbox>
        )
    } else {
        return <span></span>
    }
}

BodyPreviewText.propTypes = {
    body: PropTypes.string.isRequired
}

module.exports = BodyPreviewText
