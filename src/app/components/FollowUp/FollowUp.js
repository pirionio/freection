const React = require('react')
const {Component, PropTypes} = React
const DocumentTitle = require('react-document-title')
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

    getTitle() {
        if (this.props.things.length > 0)
            return `Follow Up (${this.props.things.length}) - Freection`
        else
            return 'Follow Up - Freection'
    }

    render() {
        return (
            <DocumentTitle title={this.getTitle()}>
                <MessagesContainer messages={this.props.things}
                                   fetchMessages={this.props.fetchFollowUps}
                                   getMessageRows={this.getThingsToFollowUp}
                                   noMessagesText="There are no things to follow up" />
            </DocumentTitle>
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