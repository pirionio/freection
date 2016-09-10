import React, {PropTypes} from 'react'

import ActionsBar from '../Actions/ActionsBar'
import {DismissAction, CloseAction} from '../Actions/Actions'
import ThingStatus from '../../../common/enums/thing-status'

const GithubActionsBar = ({thing, isRollover}) => {
    const dismissAction = DismissAction(thing)
    dismissAction.show = thing.payload.status === ThingStatus.INPROGRESS.key

    const closeAction = CloseAction(thing)
    closeAction.show = thing.payload.status === ThingStatus.DONE.key

    return <ActionsBar actions={[dismissAction, closeAction]} isRollover={isRollover} />
}

GithubActionsBar.propTypes = {
    thing: PropTypes.object.isRequired,
    isRollover: PropTypes.bool
}

export default GithubActionsBar
