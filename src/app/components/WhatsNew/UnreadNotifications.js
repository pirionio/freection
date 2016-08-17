const React = require('react')
const {Component, PropTypes} = React
const {connect} = require('react-redux')
const classAutobind = require('class-autobind').default

const groupBy = require('lodash/groupBy')
const find = require('lodash/find')
const first = require('lodash/first')
const last = require('lodash/last')
const merge = require('lodash/merge')
const reject = require('lodash/reject')
const orderBy = require('lodash/orderBy')
const forOwn = require('lodash/forOwn')
const clone = require('lodash/clone')
const {chain} = require('lodash/core')

const Page = require('../UI/Page')
const styleVars = require('../style-vars')
const PreviewsContainer = require('../Preview/PreviewsContainer')
const NotificationPreviewItem = require('./NotificationPreviewItem')
const GithubPreviewItem = require('./GithubPreviewItem')
const WhatsNewActions = require('../../actions/whats-new-actions')
const EventTypes = require('../../../common/enums/event-types')
const EntityTypes = require('../../../common/enums/entity-types')

class WhatsNew extends Component {
    constructor(props) {
        super(props)
        classAutobind(this)
    }

    fetchWhatsNew() {
        const {dispatch} = this.props
        dispatch(WhatsNewActions.fetchWhatsNew())
    }

    getNotificationRows() {
        const {notifications} = this.props
        const notificationsByThing = groupBy(notifications, notification => notification.thing.id)

        let notificationsToShow = []

        // We want to aggregate notifications that belong to the very same thing. That's why we grouped them according to Thing.
        forOwn(notificationsByThing, (thingNotifications) => {
            const commentNotifications = chain(thingNotifications)
                .filter(notification => [EventTypes.CREATED.key, EventTypes.COMMENT.key].includes(notification.eventType.key))
                .sortBy('createdAt')
                .value()
            const oldest = first(commentNotifications)
            const newest = last(commentNotifications)

            // Notice below how the createdAt field will be taken from the newest comment we found.
            // That's because if indeed many comments arrived, we'd like the final aggregated notification to be ordered among all other notifications
            // based on the last comment that arrived. The text, however, of the notification, will be that of the FIRST comment that arrived.
            if (oldest) {
                notificationsToShow.push(merge(clone(oldest), {
                    payload: {
                        numOfNewComments: commentNotifications.length
                    },
                    createdAt: newest ? newest.createdAt : oldest.createdAt
                }))
            }

            // Here we add the rest of the notifications.
            notificationsToShow.push(...reject(thingNotifications, notification => 
                [EventTypes.CREATED.key, EventTypes.COMMENT.key].includes(notification.eventType.key)
            ))
        })

        return orderBy(notificationsToShow, 'createdAt', 'desc').map(notification => {
            if (notification.thing.type.key === EntityTypes.GITHUB.key)
                return <GithubPreviewItem notification={notification} key={notification.id} />
            else
                return <NotificationPreviewItem notification={notification} key={notification.id} />
        })
    }

    getTitle() {
        // TODO: should we return the aggregated number instead?
        if (this.props.notifications.length > 0)
            return `Freection (${this.props.notifications.length}) - What's New?`
        else
            return 'Freection - What\'s New?'
    }

    getNoPreviews() {
        return {
            texts: [
                'Nothing new under the sun.',
                'Stop checking your Freection so often!'
            ],
            logoColor: styleVars.highlightColor
        }
    }
    
    render () {
        const {invalidationStatus} = this.props
        
        return (
            <Page title={this.getTitle()}>
                <PreviewsContainer previewItems={this.getNotificationRows()}
                                   fetchPreviews={this.fetchWhatsNew}
                                   noPreviews={this.getNoPreviews()}
                                   invalidationStatus={invalidationStatus} />
            </Page>
        )
    }
}

WhatsNew.propTypes = {
    notifications: PropTypes.array.isRequired,
    invalidationStatus: PropTypes.string.isRequired
}

function mapStateToProps(state) {
    return {
        notifications: state.whatsNew.notifications,
        invalidationStatus: state.whatsNew.invalidationStatus
    }
}

module.exports = connect(mapStateToProps)(WhatsNew)