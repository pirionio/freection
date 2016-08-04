const React = require('react')
const {Component, PropTypes} = React
const {connect} = require('react-redux')

const ActionsBar = require('../Actions/ActionsBar')
const {DoAction, DoneAction, DismissAction, CloseAction, CancelAction, SendBackAction} = require('../Actions/Actions')

class ThingPageActionsBar extends Component {
    render() {
        const {thing, currentUser} = this.props

        const actions = [
            DoAction(thing, currentUser),
            DoneAction(thing, currentUser),
            DismissAction(thing, currentUser),
            CloseAction(thing, currentUser),
            CancelAction(thing, currentUser),
            SendBackAction(thing, currentUser)
        ]

        return (
            <div>
                <ActionsBar actions={actions} />
            </div>
        )
    }
}

ThingPageActionsBar.propTypes = {
    thing: PropTypes.object.isRequired,
    currentUser: PropTypes.object.isRequired
}

function mapStateToProps(state) {
    return {
        currentUser: state.auth
    }
}

module.exports = connect(mapStateToProps)(ThingPageActionsBar)