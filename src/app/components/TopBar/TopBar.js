const React = require('react')
const {Component, PropTypes} = React
const {connect} = require('react-redux')
const classAutobind = require('class-autobind').default
const radium = require('radium')

const {chain} = require('lodash/core')
const keys = require('lodash/keys')
const groupBy = require('lodash/groupBy')

const EventTypes = require('../../../common/enums/event-types')
const UserInfo = require('./UserInfo')

const Flexbox = require('../UI/Flexbox')
const styleVars = require('../style-vars')

class TopBar extends Component {
    constructor(props) {
        super(props)
        classAutobind(this, TopBar.prototype)
    }

    getCreatedCount() {
        const styles = this.getStyles()

        const count = chain(this.props.newNotifications)
            .filter(notification => notification.eventType.key === EventTypes.CREATED.key)
            .value()
            .length

        return <span style={[styles.count, styles.notLastCount]} key="created">{count} New Things</span>
    }

    getCommentsCount() {
        const styles = this.getStyles()

        const notifications = chain(this.props.newNotifications)
            .filter(notification => notification.eventType.key === EventTypes.COMMENT.key)
            .value()

        const count = keys(groupBy(notifications, 'thingId')).length

        return <span style={[styles.count, styles.notLastCount]} key="comments">{count} Unread Messages</span>
    }

    getToDoCount() {
        const styles = this.getStyles()
        const count = this.props.todoThings.length
        return <span style={[styles.count, styles.notLastCount]} key="todos">{count} To Dos</span>
    }

    getFollowUpCount() {
        const styles = this.getStyles()
        const count = this.props.followUpThings.length
        return <span style={[styles.count, styles.notLastCount]} key="follow-ups">{count} Follow Ups</span>
    }

    getEmailsCount() {
        const styles = this.getStyles()
        const count = keys(groupBy(this.props.newEmails, 'payload.threadId')).length
        return <span key="emails" style={styles.count}>{count} Unread Emails</span>
    }

    getAllCounts() {
        return [this.getCreatedCount(), this.getCommentsCount(), this.getToDoCount(), this.getFollowUpCount(), this.getEmailsCount()]
    }

    getStyles() {
        return {
            topBar: {
                height: '75px',
                padding: '0 47px 0 55px',
                backgroundColor: styleVars.secondaryColor,
                color: 'white'
            },
            count: {
                height: '13px',
                padding: '0 13px'
            },
            notLastCount: {
                borderRight: '1px solid white'
            }
        }
    }

    render () {
        const {currentUser} = this.props

        const styles = this.getStyles()
        const counts = this.getAllCounts()

        return (
            <Flexbox name="top-bar" shrink={0} container="row" justifyContent="flex-end" alignItems="center" style={styles.topBar}>
                <Flexbox name="count-summary" grow={1}>
                    Greetings {currentUser.firstName}! You have:
                    {counts}
                </Flexbox>
                <UserInfo />
            </Flexbox>
        )
    }
}

TopBar.propTypes = {
    newNotifications: PropTypes.array.isRequired,
    todoThings: PropTypes.array.isRequired,
    followUpThings: PropTypes.array.isRequired,
    newEmails: PropTypes.array.isRequired,
    currentUser: PropTypes.object.isRequired
}

function mapStateToProps(state) {
    return {
        newNotifications: state.whatsNew.notifications,
        todoThings: state.toDo.things,
        followUpThings: state.followUps.followUps,
        newEmails: state.unreadEmails.emails,
        currentUser: state.auth
    }
}

module.exports = connect(mapStateToProps)(radium(TopBar))