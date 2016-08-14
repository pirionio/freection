const React = require('react')
const {Component, PropTypes} = React
const {connect} = require('react-redux')

const ActionsBar = require('../Actions/ActionsBar')
const {CloseAction, SendBackAction, PingAction} = require('../Actions/Actions')
const ThingStatus = require('../../../common/enums/thing-status')

class FollowUpActionsBar extends Component {
    render() {
        const {thing, currentUser, isRollover} = this.props

        const closeAction = CloseAction(thing, currentUser)
        closeAction.show = currentUser && currentUser.id === thing.creator.id &&
            [ThingStatus.DONE.key, ThingStatus.DISMISS.key].includes(thing.payload.status)

        const actions = [
            closeAction,
            SendBackAction(thing, currentUser),
            PingAction(thing, currentUser)
        ]

        return (
            <div>
                <ActionsBar actions={actions} isRollover={isRollover} />
            </div>
        )
    }
}

FollowUpActionsBar.propTypes = {
    thing: PropTypes.object.isRequired,
    currentUser: PropTypes.object.isRequired,
    isRollover: PropTypes.bool
}

FollowUpActionsBar.defaultProps = {
    isRollover: false
}

function mapStateToProps(state) {
    return {
        currentUser: state.auth
    }
}

module.exports = connect(mapStateToProps)(FollowUpActionsBar)