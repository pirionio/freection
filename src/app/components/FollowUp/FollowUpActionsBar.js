const React = require('react')
const {Component, PropTypes} = React
const {connect} = require('react-redux')

const ActionsBar = require('../Actions/ActionsBar')
const {CloseAction, SendBackAction, PingAction} = require('../Actions/Actions')

class FollowUpActionsBar extends Component {
    render() {
        const {thing, currentUser} = this.props

        const actions = [
            CloseAction(thing, currentUser),
            SendBackAction(thing, currentUser),
            PingAction(thing, currentUser)
        ]

        return (
            <div>
                <ActionsBar actions={actions} />
            </div>
        )
    }
}

FollowUpActionsBar.propTypes = {
    thing: PropTypes.object.isRequired,
    currentUser: PropTypes.object.isRequired
}

function mapStateToProps(state) {
    return {
        currentUser: state.auth
    }
}

module.exports = connect(mapStateToProps)(FollowUpActionsBar)