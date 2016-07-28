const React = require('react')
const {Component, PropTypes} = React
const {connect} = require('react-redux')

const ThingRow = require('../Messages/ThingRow')

class DoThing extends Component {
    render () {
        return (
            <ThingRow thing={this.props.thing}
                      currentUser={this.props.currentUser}
                      context="/todo"
                      abort={true} />
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