const React = require('react')
const {Component, PropTypes} = React
const {withRouter} = require('react-router')
const dateFns = require('date-fns')

class MessageRow extends Component {
    constructor(props) {
        super(props)
        this.showThing = this.showThing.bind(this)
    }

    showThing() {
        this.props.router.push({
            pathname: `/tasks/${this.props.message.entityId}`,
            query: {from: this.props.context, messageId: this.props.message.id}
        })
    }

    getReferencedUser() {
        const {message, currentUser} = this.props
        return !message.to ?
            message.creator.email :
            currentUser.id === message.creator.id ? message.to.email : message.creator.email
    }

    render () {
        const {message} = this.props
        const createdAt = dateFns.format(message.createdAt, 'DD-MM-YYYY HH:mm')

        const messageEventType = message.eventType ?
            <div className="message-event-type">
                ({message.eventType.label})
            </div> : ''

        const unreadCount = message.payload.numOfNewComments > 1 ?
            <div className="message-unread-count">
                (+{message.payload.numOfNewComments - 1})
            </div> : ''

        const actions = this.props.actions || ''

        return (
            <div className="message">
                <div className="message-content">
                    <div className="inner-row">
                        <div className="message-creator">
                            {this.getReferencedUser()}
                        </div>
                        <div className="message-title">
                            <div className="message-subject">
                                <a onClick={this.showThing}>{message.subject}</a>
                            </div>
                            {messageEventType}
                        </div>
                        <div className="message-creation-time">
                            {createdAt}
                        </div>
                    </div>
                    <div className="inner-row">
                        <div className="message-text">
                            {message.payload.text}
                        </div>
                        {unreadCount}
                    </div>
                </div>
                <div className="message-actions">
                    {actions}
                </div>
            </div>
        )
    }
}

MessageRow.propTypes = {
    message: PropTypes.object.isRequired,
    currentUser: PropTypes.object.isRequired,
    actions: PropTypes.array.isRequired,
    context: PropTypes.string.isRequired
}

module.exports = withRouter(MessageRow)