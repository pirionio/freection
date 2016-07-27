const React = require('react')
const {Component, PropTypes} = React
const {connect} = require('react-redux')

const ThingRow = require('../Messages/ThingRow')
const Action = require('../Messages/Action')

const ThingCommandActions = require('../../actions/thing-command-actions')

class DoThing extends Component {
    constructor(props) {
        super(props)
        this.markThingAsDone = this.markThingAsDone.bind(this)
    }

    markThingAsDone() {
        const {thing, dispatch} = this.props
        dispatch(ThingCommandActions.markThingAsDone(thing))
    }

    getActions() {
        return [
            <Action label="Done" doFunc={this.markThingAsDone} key="action-Done" />
        ]
    }

    render () {
        const actions = this.getActions()

        return (
            <ThingRow thing={this.props.thing}
                      currentUser={this.props.currentUser}
                      actions={actions}
                      context="/todo" />
        )
    }
}

DoThing.propTypes = {
    thing: PropTypes.object.isRequired,
    currentUser: PropTypes.object.isRequired
}

function mapStateToProps(state) {
    return {
        currentUser: state.auth
    }
}

module.exports = connect(mapStateToProps)(DoThing)