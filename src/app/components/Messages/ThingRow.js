const React = require('react')
const {Component, PropTypes} = React
const {includes, sortBy, first, last} = require('lodash')

const MessageRow = require('../Messages/MessageRow')

class ThingRow extends Component {
    constructor(props) {
        super(props)
        this.completeThing = this.completeThing.bind(this)
    }

    getUnreadComments() {
        const {thing} = this.props

        return sortBy(thing.comments.filter(comment => !comment.payload.isRead), 'createdAt')
    }

    getReadComments() {
        const {thing} = this.props

        return sortBy(thing.comments.filter(comment => comment.payload.isRead), 'createdAt')
    }

    completeThing() {
        this.props.markThingAsDone(this.props.thing)
    }

    getMessagePreview() {const {thing} = this.props
        const unreadComments = this.getUnreadComments()
        const readComments = this.getReadComments()

        // If there are unread comments, show the first of them.
        if (unreadComments && unreadComments.length) {
            return first(unreadComments).payload.text
        }

        // If there are only read comments, show the last of them.
        if (readComments && readComments.length) {
            return last(readComments).payload.text
        }

        return thing.body
    }

    getThingViewModel() {
        const {thing} = this.props
        const unreadComments = this.getUnreadComments()

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