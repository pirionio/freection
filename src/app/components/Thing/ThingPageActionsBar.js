const React = require('react')
const {Component, PropTypes} = React
const {connect} = require('react-redux')

const ActionsBar = require('../Actions/ActionsBar')
const {DoAction, DoneAction, DismissAction, CloseAction, SendBackAction} = require('../Actions/Actions')
const styleVars = require('../style-vars')

class ThingPageActionsBar extends Component {
    isDisabled() {
        return this.props.ongoingAction
    }

    render() {
        const {thing, currentUser} = this.props

        const actions = [
            DoAction(thing, currentUser, this.isDisabled()),
            DoneAction(thing, currentUser, this.isDisabled()),
            DismissAction(thing, currentUser, this.isDisabled()),
            CloseAction(thing, currentUser, this.isDisabled()),
            SendBackAction(thing, currentUser, this.isDisabled())
        ]

        return (
            <div name="thing-page-actions-bar">
                <ActionsBar actions={actions} supportRollover={false} />
            </div>
        )
    }
}

ThingPageActionsBar.propTypes = {
    thing: PropTypes.object.isRequired,
    currentUser: PropTypes.object.isRequired,
    ongoingAction: PropTypes.bool.isRequired
}

function mapStateToProps(state) {
    return {
        currentUser: state.auth,
        ongoingAction: state.thingPage.ongoingAction
    }
}

module.exports = connect(mapStateToProps)(ThingPageActionsBar)