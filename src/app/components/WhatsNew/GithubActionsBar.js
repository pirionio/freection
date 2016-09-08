import React, {PropTypes} from 'react'

import ActionsBar from '../Actions/ActionsBar'
import {DoAction, DismissAction, CloseAction} from '../Actions/Actions'
import ThingStatus from '../../../common/enums/thing-status'

const GithubActionsBar = ({notification, isRollover}) => {
    const doAction = DoAction(notification.thing)
    doAction.show = notification.thing.payload.status === ThingStatus.NEW.key

    const dismissAction = DismissAction(notification.thing)
    dismissAction.show = notification.thing.payload.status === ThingStatus.NEW.key

    const closeAction = CloseAction(notification.thing)
    closeAction.show = notification.thing.payload.status === ThingStatus.DONE.key

    return <ActionsBar actions={[doAction, dismissAction, closeAction]} isRollover={isRollover} />
}

GithubActionsBar.propTypes = {
    notification: PropTypes.object.isRequired,
    isRollover: PropTypes.bool
}

export default GithubActionsBar
