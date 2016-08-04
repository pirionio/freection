const React = require('react')
const {PropTypes} = React

const ActionsBar = require('../Actions/ActionsBar')
const {DismissAction, CloseAction} = require('../Actions/Actions')
const ThingStatus = require('../../../common/enums/thing-status')

const GithubActionsBar = ({thing}) => {
    const dismissAction = DismissAction(thing)
    dismissAction.show = thing.payload.status === ThingStatus.INPROGRESS.key

    const closeAction = CloseAction(thing)
    closeAction.show = thing.payload.status === ThingStatus.DONE.key

    return <ActionsBar actions={[dismissAction, closeAction]} />
}

GithubActionsBar.propTypes = {
    thing: PropTypes.object.isRequired
}

module.exports = GithubActionsBar
