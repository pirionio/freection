const React = require('react')
const {Component, PropTypes} = React
const {connect} = require('react-redux')

const ThingRow = require('../Messages/ThingRow')

class FollowUpThing extends Component {
    render () {
        return (
            <ThingRow thing={this.props.thing}
                      currentUser={this.props.currentUser}
                      actions={[]}
                      context="/followup" />
        )
    }
}

FollowUpThing.propTypes = {
    thing: PropTypes.object.isRequired,
    currentUser: PropTypes.object.isRequired
}

const mapStateToProps = (state) => {
    return {
        currentUser: state.auth
    }
}

module.exports = connect(mapStateToProps)(FollowUpThing)