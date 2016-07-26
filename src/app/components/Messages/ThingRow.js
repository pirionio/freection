const React = require('react')
const {Component, PropTypes} = React

const sortBy = require('lodash/sortBy')
const first = require('lodash/first')
const last = require('lodash/last')
const chain = require('lodash/core')

const MessageRow = require('../Messages/MessageRow')

const EventTypes = require('../../../common/enums/event-types')

class ThingRow extends Component {
    filterEventsByRead(isRead) {
        const {thing} = this.props
        return chain(thing.events)
            .filter(comment => comment.payload.isRead === isRead && comment.eventType.key === EventTypes.COMMENT.key)
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

        return Object.assign({}, thing, {
            entityId: thing.id,
            payload: {
                text: this.getMessagePreview(),
                numOfNewComments: unreadComments.length
            }
        })
    }

    render () {
        const thing = this.getThingViewModel()

        return (
            <MessageRow message={thing}
                        currentUser={this.props.currentUser}
                        actions={this.props.actions}
                        context={this.props.context} />
        )
    }
}

ThingRow.propTypes = {
    thing: PropTypes.object.isRequired,
    currentUser: PropTypes.object.isRequired,
    actions: PropTypes.array.isRequired,
    context: PropTypes.string.isRequired
}

module.exports = ThingRow