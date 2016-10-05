import React, {PropTypes} from 'react'

import ActionsBar from '../Actions/ActionsBar'
import {CloseAction} from '../Actions/Actions'

const EmailThingActionsBar = ({thing, isRollover}) => {
    const closeAction = CloseAction(thing)
    closeAction.show = true
    
    return <ActionsBar actions={[closeAction]} isRollover={isRollover} />
}

EmailThingActionsBar.propTypes = {
    thing: PropTypes.object.isRequired,
    isRollover: PropTypes.bool
}

export default EmailThingActionsBar
