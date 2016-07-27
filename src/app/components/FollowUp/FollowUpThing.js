const React = require('react')
const {Component, PropTypes} = React
const {connect} = require('react-redux')

const ThingRow = require('../Messages/ThingRow')
const Action = require('../Messages/Action')

const ThingCommandActions = require('../../actions/thing-command-action')

class FollowUpThing extends Component {
    constructor(props) {
        super(props)
        this.pingThing = this.pingThing.bind(this)
    }

    pingThing() {
        const {thing, dispatch} = this.props
        dispatch(ThingCommandActions.ping(thing))
    }

    getActions() {
        return [
            <Action label="Ping" doFunc={this.pingThing} key="action-Ping" />
        ]
    }

    render () {
        return (
            <ThingRow thing={this.props.thing}
                      currentUser={this.props.currentUser}
                      actions={this.getActions()}
                      context="/followup" />
        )
    }
}

FollowUpThing.propTypes = {
    thing: PropTypes.object.isRequired,
    currentUser: PropTypes.object.isRequired
}

function mapStateToProps(state) {
    return {
        currentUser: state.auth
    }
}

module.exports = connect(mapStateToProps)(FollowUpThing)