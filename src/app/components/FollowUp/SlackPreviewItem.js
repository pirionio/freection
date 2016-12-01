import React, {PropTypes, Component} from 'react'

import PreviewItem, { PreviewItemStatus, PreviewItemText, PreviewItemActions} from '../Preview/PreviewItem'
import ThingStatus from '../../../common/enums/thing-status'
import styleVars from '../style-vars'
import CommandBar from '../Commands/CommandsBar.js'

class SlackPreviewItem extends Component {
    getCircleColor() {
        const {thing} = this.props

        switch (thing.payload.status) {
            case ThingStatus.CLOSE.key:
            case ThingStatus.DISMISS.key:
                return styleVars.redCircleColor
            case ThingStatus.NEW.key:
            case ThingStatus.INPROGRESS.key:
            case ThingStatus.REOPENED.key:
                return styleVars.blueCircleColor
            case ThingStatus.DONE.key:
                return styleVars.greenCircleColor
        }
    }

    render() {
        const {thing, commands} = this.props

        return (
            <PreviewItem circleColor={this.getCircleColor()}
                         title={thing.subject}
                         date={thing.createdAt}>
                <PreviewItemStatus>
                    <span>You sent <strong>{thing.to.displayName}</strong> task in slack</span>
                </PreviewItemStatus>
                <PreviewItemText />
                <PreviewItemActions>
                    <CommandBar thing={thing} commands={commands} />
                </PreviewItemActions>
            </PreviewItem>
        )
    }
}

SlackPreviewItem.propTypes = {
    thing: PropTypes.object.isRequired,
    commands: PropTypes.array.isRequired
}

export default SlackPreviewItem
