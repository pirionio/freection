const React = require('react')
const {Component, PropTypes} = React
const {connect} = require('react-redux')
const ThingPageActions = require('../../actions/thing-page-actions')
const EmailPageActions = require('../../actions/email-page-actions')
const dateFns = require('date-fns')
const classnames = require('classnames')

const EmailPreviewActionsBar = require('../Emails/EmailPreviewActionsBar')
const EntityTypes = require('../../../common/enums/entity-types')

class MessageRow extends Component {
    constructor(props) {
        super(props)
        this.show = this.show.bind(this)
    }

    show() {
        const {message} = this.props
        
        if (message.type.key === EntityTypes.EMAIL.key)
            this.props.dispatch(EmailPageActions.show(message.entityId))
        else
            this.props.dispatch(ThingPageActions.show(message.entityId))
    }

    getReferencedUser() {
        const {message, currentUser} = this.props

        const thing = message.thing ? message.thing : message

        if (thing.type.key === EntityTypes.GITHUB.key) {
            return thing.payload.creator.username
        }

        return !message.to ?
            message.creator.email :
            currentUser.id === message.creator.id ? message.to.email : message.creator.email
    }

    getThingLink() {
        const {message} = this.props
        const thing = message.thing ? message.thing : message

        if (thing.type.key === EntityTypes.GITHUB.key) {
            return (<a href={thing.payload.url} target="blank">{message.subject}</a>)
        }

        return (<a onClick={this.show}>{message.subject}</a>)
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

        const actionsBar = message.payload && message.payload.emailIds ?
            <EmailPreviewActionsBar emailIds={message.payload.emailIds} /> :
            ''

        return (
            <div className="message">
                <div className="message-content">
                    <div className="inner-row">
                        <div className="message-creator">
                            {this.getReferencedUser()}
                        </div>
                        <div className="message-title">
                            <div className={messageSubjectClass}>
                                {this.getThingLink()}
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