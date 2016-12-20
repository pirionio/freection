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

        if (thing.payload.threadIdHex)
            return `https://mail.google.com/mail/u/${currentUser.email}/#inbox/${thing.payload.threadIdHex}`

        // If we don't have the threadId of the email, the only way to send the user right to it is to open Gmail
        // with a pre-defined search query for the email's message-id.
        const emailId = encodeURIComponent(`rfc822msgid:${thing.payload.emailId}`)
        return `https://mail.google.com/mail/u/${currentUser.email}/#search/${emailId}`
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
        const {thing, commands, index, reorder, commitReorder, allowDrag, allowDrop} = this.props

        return (
            <PreviewCard thing={thing}
                         entityId={thing.id}
                         index={index}
                         category={thing.todoTimeCategory}
                         reorder={reorder}
                         commitReorder={commitReorder}
                         allowDrag={allowDrag}
                         allowDrop={allowDrop}
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
