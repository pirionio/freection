import React, {PropTypes, Component} from 'react'
import {connect} from 'react-redux'
import classAutobind from 'class-autobind'

import PreviewCard from '../Preview/PreviewCard'
import {PreviewCardRecipients, PreviewCardActions} from '../Preview/PreviewCard'
import CommandsBar from '../Commands/CommandsBar.js'
import * as ThingPageActions from '../../actions/thing-page-actions'

class FollowUpPreviewItem extends Component {
    constructor(props) {
        super(props)
        classAutobind(this, FollowUpPreviewItem.prototype)
    }

    getRecipients() {
        const {thing} = this.props
        return thing.to.displayName
    }

    render() {
        const {thing, commands, index, dispatch} = this.props

        return (
            <PreviewCard thing={thing}
                         entityId={thing.id}
                         index={index}
                         category={thing.to.displayName}
                         onClick={() => dispatch(ThingPageActions.show(thing))}
                         allowDrag={false}>
                <PreviewCardRecipients>
                    <span>{this.getRecipients()}</span>
                </PreviewCardRecipients>
                <PreviewCardActions>
                    <CommandsBar thing={thing} commands={commands} supportRollover={false} />
                </PreviewCardActions>
            </PreviewCard>
        )
    }
}

FollowUpPreviewItem.propTypes = {
    thing: PropTypes.object.isRequired,
    commands: PropTypes.array.isRequired,
    index: PropTypes.number.isRequired
}

export default connect()(FollowUpPreviewItem)
