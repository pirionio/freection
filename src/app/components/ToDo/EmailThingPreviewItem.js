import React, {PropTypes, Component} from 'react'
import {connect} from 'react-redux'
import useSheet from 'react-jss'
import classAutobind from 'class-autobind'
import trimEnd from 'lodash/trimEnd'

import PreviewCard from '../Preview/PreviewCard'
import {PreviewCardRecipients, PreviewCardActions} from '../Preview/PreviewCard'
import CommandsBar from '../Commands/CommandsBar.js'

class EmailThingPreviewItem extends Component {
    constructor(props) {
        super(props)
        classAutobind(this, EmailThingPreviewItem.prototype)
    }

    getEmailUrl() {
        const {thing, currentUser} = this.props
        return `https://mail.google.com/mail/u/${currentUser.email}/#inbox/${thing.payload.threadIdHex}`
    }

    getRecipients() {
        const {thing, currentUser} = this.props
        const recipientNames = thing.payload.recipients
            .filter(recipient => recipient.emailAddress !== currentUser.email)
            .map(recipient => recipient.name)
            .join(', ')
        return trimEnd(recipientNames, ', ')
    }

    render() {
        const {thing, commands, index, reorder, commitReorder} = this.props

        return (
            <PreviewCard thing={thing}
                         entityId={thing.id}
                         index={index}
                         category={thing.todoTimeCategory}
                         reorder={reorder}
                         commitReorder={commitReorder}
                         onClick={() => window.open(this.getEmailUrl(), '_blank')}>
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

const style = {
    textRow: {
        minWidth: 0
    }
}

EmailThingPreviewItem.propTypes = {
    thing: PropTypes.object.isRequired,
    commands: PropTypes.array.isRequired,
    currentUser: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    reorder: PropTypes.func.isRequired,
    commitReorder: PropTypes.func.isRequired
}

function mapStateToProps(state) {
    return {
        currentUser: state.auth
    }
}

export default useSheet(connect(mapStateToProps)(EmailThingPreviewItem), style)
