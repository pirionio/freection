const React = require('react')
const {PropTypes} = React

const ActionsBar = require('../Actions/ActionsBar')
const {DismissAction, CloseAction} = require('../Actions/Actions')
const ThingStatus = require('../../../common/enums/thing-status')

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

module.exports = GithubActionsBar
