const React = require('react')
const {Component, PropTypes} = React
const useSheet = require('react-jss').default

import EventTypes from '../../../common/enums/event-types'
const {PreviewItem, PreviewItemStatus, PreviewItemText, PreviewItemActions} = require('../Preview/PreviewItem')
const GithubActionsBar = require('./GithubActionsBar')
const TextTruncate = require('../UI/TextTruncate')
const TextSeparator = require('../UI/TextSeparator')
const Flexbox = require('../UI/Flexbox')
const styleVars = require('../style-vars')

class GithubPreviewItem extends Component {
    getTextElement() {
        const {notification, sheet: {classes}} = this.props

        if (notification.thing.body) {
            return (
                <Flexbox container="row">
                    <Flexbox shrink={0}><TextSeparator /></Flexbox>
                    <Flexbox grow={1} className={classes.textRow}>
                        <TextTruncate>
                            {notification.thing.body}
                        </TextTruncate>
                    </Flexbox>
                </Flexbox>)
        }

        return null
    }

    render() {
        const {notification} = this.props

        const color = notification.eventType.key === EventTypes.CREATED.key ?
            styleVars.blueCircleColor :
            styleVars.greenCircleColor
        const {creator} = notification

        const text = notification.eventType.key === EventTypes.CREATED.key ?
            <span><strong>{creator.displayName}</strong> opened an issue on github</span> :
            <span><strong>{creator.displayName}</strong> closed an issue on github</span>

        return (
            <PreviewItem circleColor={color}
                         title={notification.thing.subject}
                         date={notification.createdAt}
                         onClick={() => window.open(notification.thing.payload.url, '_blank')}>
                <PreviewItemStatus>
                    {text}
                </PreviewItemStatus>
                <PreviewItemText>
                    {this.getTextElement()}
                </PreviewItemText>
                <PreviewItemActions>
                    <GithubActionsBar notification={notification}/>
                </PreviewItemActions>
            </PreviewItem>
        )
    }
}

const style = {
    textRow: {
        minWidth: 0
    }
}

GithubPreviewItem.propTypes = {
    notification: PropTypes.object.isRequired
}

module.exports = useSheet(GithubPreviewItem, style)
