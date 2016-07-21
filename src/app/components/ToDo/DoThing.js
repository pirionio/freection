const React = require('react')
const {Component, PropTypes} = React
const {connect} = require('react-redux')

const ThingRow = require('../Messages/ThingRow')
const Action = require('../Messages/Action')

const CompleteThingActions = require('../../actions/complete-thing-actions')

class DoThing extends Component {
    constructor(props) {
        super(props)
        this.completeThing = this.completeThing.bind(this)
    }

    completeThing() {
        this.props.completeThing(this.props.thing)
    }

    getActions() {
        return [
            <Action label="Done" doFunc={this.completeThing} key="action-Done" />
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

const mapStateToProps = (state) => {
    return {
        currentUser: state.auth
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        completeThing: (thing) => dispatch(CompleteThingActions.completeThing(thing))
    }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(DoThing)