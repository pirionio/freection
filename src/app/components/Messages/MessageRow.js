const React = require('react')
const {Component, PropTypes} = React
const {connect} = require('react-redux')
const ThingPageActions = require('../../actions/thing-page-actions')
const dateFns = require('date-fns')
const classnames = require('classnames')

const ActionsBar = require('../Actions/ActionsBar')

class MessageRow extends Component {
    constructor(props) {
        super(props)
        this.showThing = this.showThing.bind(this)
    }

    showThing() {
        this.props.dispatch(ThingPageActions.show(this.props.message.entityId))
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

        const messageSubjectClass = classnames('message-subject', {
            'with-status': !!message.eventType
        })

        const messageEventType = message.eventType ?
            <div className="message-event-type">
                ({message.eventType.label})
            </div> : ''

        const unreadCount = message.payload.numOfNewComments > 1 ?
            <div className="message-unread-count">
                (+{message.payload.numOfNewComments - 1})
            </div> : ''

        const actionsBar = message && message.thing ?
            <ActionsBar thing={message.thing} notification={message} cancel={this.props.cancel} ping={false} /> :
            <ActionsBar thing={message} cancel={this.props.cancel} />

        return (
            <div className="message">
                <div className="message-content">
                    <div className="inner-row">
                        <div className="message-creator">
                            {this.getReferencedUser()}
                        </div>
                        <div className="message-title">
                            <div className={messageSubjectClass}>
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
                    {actionsBar}
                </div>
            </div>
        )
    }
}

MessageRow.propTypes = {
    message: PropTypes.object.isRequired,
    currentUser: PropTypes.object.isRequired,
    context: PropTypes.string.isRequired,
    cancel: PropTypes.bool
}

MessageRow.defaultProps = {
    cancel: false
}

module.exports = connect()(MessageRow)