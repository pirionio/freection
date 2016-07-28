const React = require('react')
const {Component, PropTypes} = React

const first = require('lodash/first')
const last = require('lodash/last')
const includes = require('lodash/includes')
const chain = require('lodash/core')

const MessageRow = require('../Messages/MessageRow')

const EventTypes = require('../../../common/enums/event-types')
const immutable = require('../../util/immutable')

class ThingRow extends Component {
    filterEventsByRead(isRead) {
        const {thing} = this.props
        return chain(thing.events)
            .filter(event => includes([EventTypes.COMMENT.key, EventTypes.PING.key], event.eventType.key) && event.payload.isRead === isRead)
            .sortBy('createdAt')
            .value()
    }

    getMessagePreview() {const {thing} = this.props
        const unreadEvents = this.filterEventsByRead(false)
        const readEvents = this.filterEventsByRead(true)

        // If there are unread events, show the first of them.
        if (unreadEvents && unreadEvents.length) {
            return first(unreadEvents).payload.text
        }

        // If there are only read events, show the last of them.
        if (readEvents && readEvents.length) {
            return last(readEvents).payload.text
        }

        return thing.body
    }

    getThingViewModel() {
        const {thing} = this.props
        const unreadComments = this.filterEventsByRead(false)

        return immutable(thing)
            .set('entityId', thing.id)
            .merge('payload', {
                text: this.getMessagePreview(),
                numOfNewComments: unreadComments.length
            })
            .value()
    }

    render () {
        const thing = this.getThingViewModel()

        return (
            <MessageRow message={thing}
                        currentUser={this.props.currentUser}
                        context={this.props.context}
                        abort={this.props.abort} />
        )
    }
}

ThingRow.propTypes = {
    thing: PropTypes.object.isRequired,
    currentUser: PropTypes.object.isRequired,
    context: PropTypes.string.isRequired,
    abort: PropTypes.bool
}

ThingRow.defaultProps = {
    abort: false
}

module.exports = ThingRow