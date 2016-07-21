const React = require('react')
const {Component, PropTypes} = React
const {connect} = require('react-redux')
const _ = require('lodash')

const MessagesContainer = require('../Messages/MessagesContainer')
const NewNotification = require('./NewNotification')
const WhatsNewActions = require('../../actions/whats-new-actions')
const EventTypes = require('../../../common/enums/event-types')

class WhatsNew extends Component {
    constructor(props) {
        super(props)
        this.getNotificationRows = this.getNotificationRows.bind(this)
    }

    getNotificationRows() {
        const {notifications} = this.props
        const notificationsByThing = _.groupBy(notifications, notification => notification.thing.id)

        let notificationsToShow = []

        // We want to aggregate notifications that belong to the very same thing. That's why we grouped them according to Thing.
        _.forOwn(notificationsByThing, (thingNotifications) => {
            // The CREATED event takes precedence. If there is such an event, we'd take it, and make sure that its payload shows the first comment
            // that also arrived. If there is no such event, we'd simply reduce the COMMENT events into a single one.
            const createdNotification = _.find(thingNotifications, {eventType: {key: EventTypes.CREATED.key}})
            const commentNotifications = _.chain(thingNotifications)
                .filter({eventType: {key: EventTypes.COMMENT.key}})
                .sortBy('createdAt')
                .value()
            const oldestCommentNotification = _.first(commentNotifications)
            const newestCommentNotification = _.last(commentNotifications)

            // Notice below how the createdAt field will be taken from the newest comment we found.
            // That's because if indeed many comments arrived, we'd like the final aggregated notification to be ordered among all other notifications
            // based on the last comment that arrived. The text, however, of the notification, will be that of the FIRST comment that arrived.
            if (createdNotification) {
                notificationsToShow.push(_.merge(createdNotification, {
                    payload: {
                        text: oldestCommentNotification ? oldestCommentNotification.payload.text  : createdNotification.thing.body,
                        numOfNewComments: commentNotifications.length
                    },
                    createdAt: newestCommentNotification ? newestCommentNotification.createdAt : createdNotification.createdAt
                }))
            } else if (oldestCommentNotification) {
                notificationsToShow.push(_.merge(oldestCommentNotification, {
                    payload: {
                        numOfNewComments: commentNotifications.length
                    },
                    createdAt: newestCommentNotification ? newestCommentNotification.createdAt : oldestCommentNotification.createdAt
                }))
            }

            // Here we add the rest of the notifications.
            notificationsToShow.push(..._.reject(thingNotifications, notification => {
                return notification.eventType.key === EventTypes.CREATED.key || notification.eventType.key === EventTypes.COMMENT.key;
            }))
        })

        return _.sortBy(notificationsToShow, 'createdAt').map(notification =>
            <NewNotification notification={notification} key={notification.id} />)
    }

    render () {
        return (
            <MessagesContainer messages={this.props.notifications}
                               fetchMessages={this.props.fetchWhatsNew}
                               getMessageRows={this.getNotificationRows}
                               noMessagesText="There are no new things" />
        )
    }
}

WhatsNew.propTypes = {
    notifications: PropTypes.array.isRequired
}

const mapStateToProps = (state) => {
    return {
        notifications: state.whatsNew.notifications
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchWhatsNew: () => dispatch(WhatsNewActions.fetchWhatsNew())
    }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(WhatsNew)