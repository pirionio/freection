import React,{PropTypes, Component} from 'react'
import {connect} from 'react-redux'
import classAutobind from 'class-autobind'
import trimEnd from 'lodash/trimEnd'

import * as ThingPageActions from '../../actions/thing-page-actions'
import PreviewCard from '../Preview/PreviewCard'
import {PreviewCardRecipients, PreviewCardActions} from '../Preview/PreviewCard'
import CommandsBar from '../Commands/CommandsBar.js'
import EntityTypes from '../../../common/enums/entity-types'

class TodoPreviewItem extends Component {
    constructor(props) {
        super(props)
        classAutobind(this, TodoPreviewItem.prototype)
    }

    getRecipients() {
        const {thing} = this.props

        return thing.isCreator ? 'Me' :
            thing.type.key === EntityTypes.THING.key ? thing.creator.displayName :
            thing.type.key === EntityTypes.EMAIL_THING ? this.getEmailRecipients() :
            ''
    }

    getEmailRecipients() {
        const {thing, currentUser} = this.props

        const recipientNames = thing.payload.recipients
            .filter(recipient => recipient.emailAddress !== currentUser.email)
            .map(recipient => recipient.name)
            .join(', ')

        return trimEnd(recipientNames, ', ')
    }

    render() {
        const {thing, commands, index, reorder, commitReorder, dispatch} = this.props

        return (
            <PreviewCard thing={thing}
                         entityId={thing.id}
                         index={index}
                         category={thing.todoTimeCategory}
                         reorder={reorder}
                         commitReorder={commitReorder}
                         onClick={() => dispatch(ThingPageActions.show(thing))}>
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

TodoPreviewItem.propTypes = {
    thing: PropTypes.object.isRequired,
    commands: PropTypes.array.isRequired,
    index: PropTypes.number.isRequired
}

function mapStateToProps(state) {
    return {
        currentUser: state.auth
    }
}

export default connect(mapStateToProps)(TodoPreviewItem)
