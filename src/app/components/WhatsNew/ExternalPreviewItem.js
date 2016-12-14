import React, {Component, PropTypes} from 'react'
import useSheet from 'react-jss'
import classAutobind from 'class-autobind'

import EventTypes from '../../../common/enums/event-types'
import PreviewItem, { PreviewItemStatus, PreviewItemText, PreviewItemActions} from '../Preview/PreviewItem'
import TextTruncate from '../UI/TextTruncate'
import TextSeparator from '../UI/TextSeparator'
import Flexbox from '../UI/Flexbox'
import styleVars from '../style-vars'
import CommandsBar from '../Commands/CommandsBar.js'
import UserTypes from '../../../common/enums/user-types'

class ExternalPreviewItem extends Component {
    constructor(props) {
        super(props)
        classAutobind(this, ExternalPreviewItem.prototype)
    }

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

    getStatus() {
        const {notification} = this.props

        const platform = UserTypes[notification.creator.type].label

        switch (notification.eventType.key) {
            case EventTypes.CREATED.key:
                return <span><strong>{notification.creator.displayName}</strong> opened an issue on {platform}</span>
            case EventTypes.SENT_BACK.key:
                return <span><strong>{notification.creator.displayName}</strong> reassigned you on {platform}</span>
            case EventTypes.UNASSIGNED.key:
                return <span><strong>{notification.creator.displayName}</strong> unassigned you on {platform}</span>
            default:
                return <span><strong>{notification.creator.displayName}</strong> closed an issue on {platform}</span>
        }
    }

    getCircleColor() {
        const {notification} = this.props

        switch (notification.eventType.key) {
            case EventTypes.CREATED.key:
            case EventTypes.SENT_BACK.key:
                return styleVars.blueCircleColor
            case EventTypes.UNASSIGNED.key:
                return styleVars.redCircleColor
            default:
                return styleVars.greenCircleColor
        }
    }

    render() {
        const {notification} = this.props

        return (
            <PreviewItem circleColor={this.getCircleColor()}
                         title={notification.thing.subject}
                         date={notification.createdAt}
                         onClick={() => window.open(notification.thing.payload.url, '_blank')}>
                <PreviewItemStatus>
                    {this.getStatus()}
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
