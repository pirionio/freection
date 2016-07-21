const React = require('react')
const {Component, PropTypes} = React
const {connect} = require('react-redux')
const {sortBy} = require('lodash/core')

const MessagesContainer = require('../Messages/MessagesContainer')
const FollowUpsActions = require('../../actions/follow-up-actions')
const FollowUpThing = require('./FollowUpThing')

class FollowUp extends Component {
    constructor(props) {
        super(props)
        this.getThingsToFollowUp = this.getThingsToFollowUp.bind(this)
    }

    getThingsToFollowUp() {
        return sortBy(this.props.things, 'createdAt').map(thing =>
            <FollowUpThing thing={thing} key={thing.id} />)
    }

    render() {
        return (
            <MessagesContainer messages={this.props.things}
                               fetchMessages={this.props.fetchFollowUps}
                               getMessageRows={this.getThingsToFollowUp}
                               noMessagesText="There are no things to follow up" />
        )
    }
}

FollowUp.propTypes = {
    things: PropTypes.array.isRequired
}

const mapStateToProps = (state) => {
    return {
        things: state.followUps.followUps
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchFollowUps: () => dispatch(FollowUpsActions.fetchFollowUps())
    }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(FollowUp)