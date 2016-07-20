const React = require('react')
const {Component, PropTypes} = React
const {connect} = require('react-redux')
const _ = require('lodash')
const ReactDOM = require('react-dom')

const {GeneralConstants} = require('../../constants')
const NewNotification = require('./NewNotification')
const WhatsNewActions = require('../../actions/whats-new-actions')
const EventTypes = require('../../../common/enums/event-types')

class WhatsNew extends Component {
    componentDidMount () {
        this.props.fetchWhatsNew()
        this.fetchInterval = setInterval(() => {
            this.props.fetchWhatsNew()
        }, GeneralConstants.FETCH_INTERVAL_MILLIS)
    }

    componentWillUpdate () {
        const node = ReactDOM.findDOMNode(this)
        this.shouldScrollBottom = (node.scrollTop + node.offsetHeight) === node.scrollHeight
    }

    componentDidUpdate () {
        if (this.shouldScrollBottom) {
            let node = ReactDOM.findDOMNode(this)
            node.scrollTop = node.scrollHeight
        }
    }

    componentWillUnmount () {
        clearInterval(this.fetchInterval)
    }

    getNotificationsToShow() {
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

        return _.sortBy(notificationsToShow, 'createdAt')
    }

    render () {
        const notificationsToShow = this.props.notifications && this.props.notifications.length ?
            this.getNotificationsToShow().map(notification => <NewNotification notification={notification} key={notification.id} />) :
            'There are no new Things'

        return (
            <div className="whats-new-container">
                <div className="whats-new-content">
                    {notificationsToShow}
                </div>
            </div>
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