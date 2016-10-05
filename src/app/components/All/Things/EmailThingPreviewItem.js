import React, {PropTypes, Component} from 'react'
import {connect} from 'react-redux'
import useSheet from 'react-jss'
import classAutobind from 'class-autobind'
import trimEnd from 'lodash/trimEnd'

import PreviewItem, {PreviewItemStatus, PreviewItemActions} from '../../Preview/PreviewItem'
import ThingStatus from '../../../../common/enums/thing-status'
import styleVars from '../../style-vars'
import ActionsBar from '../../Actions/ActionsBar'

const EmailThingActionsBar = () => {
    return <ActionsBar actions={[]} />
}

EmailThingActionsBar.propTypes = {
    thing: PropTypes.object.isRequired,
    isRollover: PropTypes.bool
}

class EmailThingPreviewItem extends Component {
    constructor(props) {
        super(props)
        classAutobind(this, EmailThingPreviewItem.prototype)
    }

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
        const {thing} = this.props

        return (
            <PreviewItem circleColor={this.getCircleColor()}
                         title={thing.subject}
                         date={thing.createdAt}
                         onClick={() => window.open(this.getEmailUrl(), '_blank')}>
                <PreviewItemStatus>
                    <span>Email from <strong>{this.getRecipients()}</strong></span>
                </PreviewItemStatus>
                <PreviewItemActions>
                    <EmailThingActionsBar thing={thing}/>
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

EmailThingPreviewItem.propTypes = {
    thing: PropTypes.object.isRequired,
    currentUser: PropTypes.object.isRequired
}

function mapStateToProps(state) {
    return {
        currentUser: state.auth
    }
}

export default useSheet(connect(mapStateToProps)(EmailThingPreviewItem), style)
