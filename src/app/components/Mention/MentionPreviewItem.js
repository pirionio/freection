import React,{PropTypes, Component} from 'react'
import {connect} from 'react-redux'
import uniq from 'lodash/uniq'
import trimEnd from 'lodash/trimEnd'

import ThingStatus from '../../../common/enums/thing-status'
import * as ThingPageActions from '../../actions/thing-page-actions'
import PreviewItem, {PreviewItemStatus, PreviewItemText, PreviewItemActions} from '../Preview/PreviewItem'
import {ThingPreviewText} from '../Preview/Thing'
import MentionActionsBar from './MentionActionsBar'
import styleVars from '../style-vars'

class MentionPreviewItem extends Component {
    getCircleColor() {
        const {thing} = this.props

        switch (thing.payload.status) {
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

    getStatus() {
        const {thing} = this.props
        const users = uniq([thing.creator.displayName, thing.to.displayName])
        return trimEnd(users.join(', '), ', ')
    }

    render() {
        const {thing, dispatch} = this.props

        return (
            <PreviewItem circleColor={this.getCircleColor()}
                         title={thing.subject}
                         date={thing.createdAt}
                         onClick={() => dispatch(ThingPageActions.showThingPage(thing))}>
                <PreviewItemStatus>
                    <strong>{this.getStatus()}</strong>
                </PreviewItemStatus>
                <PreviewItemText>
                    <ThingPreviewText thing={thing}/>
                </PreviewItemText>
                <PreviewItemActions>
                    <MentionActionsBar thing={thing} />
                </PreviewItemActions>
            </PreviewItem>
        )
    }
}

MentionPreviewItem.propTypes = {
    thing: PropTypes.object.isRequired
}

export default connect()(MentionPreviewItem)
