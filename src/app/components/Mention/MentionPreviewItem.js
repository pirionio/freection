import React,{PropTypes, Component} from 'react'
import {connect} from 'react-redux'

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

    render() {
        const {thing, dispatch} = this.props

        const textPreview = <ThingPreviewText thing={thing}/>

        return (
            <PreviewItem circleColor={this.getCircleColor()}
                         title={thing.subject}
                         date={thing.createdAt}
                         onClick={() => dispatch(ThingPageActions.showThingPage(thing))}>
                <PreviewItemStatus>
                    <strong>{thing.creator.displayName}, {thing.to.displayName}</strong>
                </PreviewItemStatus>
                <PreviewItemText>{textPreview}</PreviewItemText>
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
