const React = require('react')
const {Component, PropTypes} = React
const {connect} = require('react-redux')

const ThingRow = require('../Messages/ThingRow')
const Action = require('../Messages/Action')

const ThingCommandActions = require('../../actions/thing-command-actions')

class DoThing extends Component {
    constructor(props) {
        super(props)
        this.markAsDone = this.markAsDone.bind(this)
    }

    markAsDone() {
        const {thing, dispatch} = this.props
        dispatch(ThingCommandActions.markAsDone(thing))
    }

    getActions() {
        return [
            <Action label="Done" doFunc={this.markAsDone} key="action-Done" />
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