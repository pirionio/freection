const React = require('react')
const {Component, PropTypes} = React
const {connect} = require('react-redux')
const DocumentTitle = require('react-document-title')

const groupBy = require('lodash/groupBy')
const find = require('lodash/find')
const first = require('lodash/first')
const last = require('lodash/last')
const merge = require('lodash/merge')
const reject = require('lodash/reject')
const sortBy = require('lodash/sortBy')
const forOwn = require('lodash/forOwn')
const clone = require('lodash/clone')
const {chain} = require('lodash/core')

const PreviewsContainer = require('../Preview/PreviewsContainer')
const NotificationPreviewItem = require('./NotificationPreviewItem')
const WhatsNewActions = require('../../actions/whats-new-actions')
const EventTypes = require('../../../common/enums/event-types')

class WhatsNew extends Component {
    constructor(props) {
        super(props)
        this.getNotificationRows = this.getNotificationRows.bind(this)
    }

    getNotificationRows() {
        const {notifications} = this.props
        const notificationsByThing = groupBy(notifications, notification => notification.thing.id)

        let notificationsToShow = []

        // We want to aggregate notifications that belong to the very same thing. That's why we grouped them according to Thing.
        forOwn(notificationsByThing, (thingNotifications) => {
            // The CREATED event takes precedence. If there is such an event, we'd take it, and make sure that its payload shows the first comment
            // that also arrived. If there is no such event, we'd simply reduce the COMMENT events into a single one.
            const createdNotification = find(thingNotifications, {eventType: {key: EventTypes.CREATED.key}})
            const commentNotifications = chain(thingNotifications)
                .filter({eventType: {key: EventTypes.COMMENT.key}})
                .sortBy('createdAt')
                .value()
            const oldestCommentNotification = first(commentNotifications)
            const newestCommentNotification = last(commentNotifications)

            // Notice below how the createdAt field will be taken from the newest comment we found.
            // That's because if indeed many comments arrived, we'd like the final aggregated notification to be ordered among all other notifications
            // based on the last comment that arrived. The text, however, of the notification, will be that of the FIRST comment that arrived.
            if (createdNotification) {
                notificationsToShow.push(merge(clone(createdNotification), {
                    payload: {
                        text: oldestCommentNotification ? oldestCommentNotification.payload.text  : createdNotification.thing.body,
                        numOfNewComments: commentNotifications.length
                    },
                    createdAt: newestCommentNotification ? newestCommentNotification.createdAt : createdNotification.createdAt
                }))
            } else if (oldestCommentNotification) {
                notificationsToShow.push(merge(clone(oldestCommentNotification), {
                    payload: {
                        numOfNewComments: commentNotifications.length
                    },
                    createdAt: newestCommentNotification ? newestCommentNotification.createdAt : oldestCommentNotification.createdAt
                }))
            }

            // Here we add the rest of the notifications.
            notificationsToShow.push(...reject(thingNotifications, notification => {
                return notification.eventType.key === EventTypes.CREATED.key || notification.eventType.key === EventTypes.COMMENT.key;
            }))
        })

        return sortBy(notificationsToShow, 'createdAt').map(notification =>
            <NotificationPreviewItem notification={notification} key={notification.id} />)
    }

    getTitle() {
        // TODO: should we return the aggregated number instead?
        if (this.props.notifications.length > 0)
            return `What's New? (${this.props.notifications.length}) - Freection`
        else
            return 'What\'s New? - Freection'
    }

    render () {
        return (
            <DocumentTitle title={this.getTitle()}>
                <PreviewsContainer previewItems={this.getNotificationRows()}
                                   fetchPreviews={this.props.fetchWhatsNew}
                                   noPreviewsText="There are no new things" />
            </DocumentTitle>
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