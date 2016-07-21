const React = require('react')
const {Component, PropTypes} = React
const {includes, sortBy, first, last} = require('lodash')

const MessageRow = require('../Messages/MessageRow')

class ThingRow extends Component {
    constructor(props) {
        super(props)
        this.completeThing = this.completeThing.bind(this)
        this.initComments = this.initComments.bind(this)
    }

    componentWillMount() {
        this.initComments()
    }

    componentWillUpdate() {
        this.initComments()
    }

    initComments() {
        const {thing, currentUser} = this.props
        this.unreadComments = sortBy(thing.comments.filter(comment => includes(comment.showNewList, currentUser.id)), 'createdAt')
        this.readComments = sortBy(thing.comments.filter(comment => !includes(comment.showNewList, currentUser.id)), 'createdAt')
    }

    completeThing() {
        this.props.completeThing(this.props.thing)
    }

    getMessagePreview() {
        const {thing} = this.props

        // If there are unread comments, show the first of them.
        if (this.unreadComments && this.unreadComments.length) {
            return first(this.unreadComments).payload.text
        }

        // If there are only read comments, show the last of them.
        if (this.readComments && this.readComments.length) {
            return last(this.readComments).payload.text
        }

        return thing.body
    }

    getThingViewModel() {
        const {thing} = this.props
        return Object.assign({}, thing, {
            entityId: thing.id,
            payload: {
                text: this.getMessagePreview(),
                numOfNewComments: this.unreadComments.length
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