import React, {Component, PropTypes} from 'react'
import useSheet from 'react-jss'

import EventTypes from '../../../common/enums/event-types'
import PreviewItem, { PreviewItemStatus, PreviewItemText, PreviewItemActions} from '../Preview/PreviewItem'
import TextTruncate from '../UI/TextTruncate'
import TextSeparator from '../UI/TextSeparator'
import Flexbox from '../UI/Flexbox'
import styleVars from '../style-vars'
import CommandsBar from '../Commands/CommandsBar.js'
import UserTypes from '../../../common/enums/user-types'

class ExternalPreviewItem extends Component {
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

        const platform = UserTypes[creator.type].label

        const text = notification.eventType.key === EventTypes.CREATED.key ?
            <span><strong>{creator.displayName}</strong> opened an issue on {platform}</span> :
            <span><strong>{creator.displayName}</strong> closed an issue on {platform}</span>

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
                    <CommandsBar thing={notification.thing} commands={notification.commands} notification={notification} />
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

ExternalPreviewItem.propTypes = {
    notification: PropTypes.object.isRequired
}

export default useSheet(ExternalPreviewItem, style)
