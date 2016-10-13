import React, {PropTypes, Component} from 'react'
import {connect} from 'react-redux'

import ThingStatus from '../../../../common/enums/thing-status'
import * as ThingPageActions from '../../../actions/thing-page-actions'
import PreviewItem, {PreviewItemStatus, PreviewItemText, PreviewItemActions} from '../../Preview/PreviewItem'
import {ThingPreviewText} from '../../Preview/Thing'
import styleVars from '../../style-vars'

const AllThingsActionsBar = () => {
    return <span></span>
}

class AllThingsPreviewItem extends Component {
    getCircleColor() {
        const {thing} = this.props

        switch (thing.payload.status) {
            case ThingStatus.DISMISS.key:
                return styleVars.redCircleColor
            case ThingStatus.NEW.key:
            case ThingStatus.INPROGRESS.key:
            case ThingStatus.REOPENED.key:
                return styleVars.blueCircleColor
            case ThingStatus.CLOSE.key:
            case ThingStatus.DONE.key:
                return styleVars.greenCircleColor
        }
    }

    getStatusText() {
        const {thing, currentUser} = this.props

        if (thing.isSelf && thing.creator.id === currentUser.id)
            return <strong>Sent to myself</strong>

        if (thing.creator.id === currentUser.id)
            return <span>You sent to <strong>{thing.to.displayName}</strong></span>

        if (thing.to.id === currentUser.id)
            return <span><strong>{thing.creator.displayName}</strong> sent to you</span>

        return <span>You were mentioned</span>
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
                    {this.getStatusText()}
                </PreviewItemStatus>
                <PreviewItemText>{textPreview}</PreviewItemText>
                <PreviewItemActions>
                    <AllThingsActionsBar />
                </PreviewItemActions>
            </PreviewItem>
        )
    }
}

AllThingsPreviewItem.propTypes = {
    thing: PropTypes.object.isRequired,
    currentUser: PropTypes.object.isRequired
}

function mapStateToProps(state) {
    return {
        currentUser: state.auth
    }
}

export default connect(mapStateToProps)(AllThingsPreviewItem)
