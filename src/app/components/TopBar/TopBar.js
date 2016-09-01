const React = require('react')
const {Component, PropTypes} = React
const {connect} = require('react-redux')
const classAutobind = require('class-autobind').default

const {chain} = require('lodash/core')
const keys = require('lodash/keys')
const groupBy = require('lodash/groupBy')
const reject = require('lodash/reject')

import EventTypes from '../../../common/enums/event-types'
const Settings = require('./../SideBar/SettingsMenu')

const Flexbox = require('../UI/Flexbox')
const styleVars = require('../style-vars')

class TopBar extends Component {
    constructor(props) {
        super(props)
        classAutobind(this, TopBar.prototype)
    }

    getCreatedCount() {
        return {
            label: 'Unread Messages',
            count: chain(this.props.newNotifications)
                    .filter(notification => notification.eventType.key === EventTypes.CREATED.key)
                    .value()
                    .length
        }
    }

    getCommentsCount() {
        const notifications = chain(this.props.newNotifications)
            .filter(notification => notification.eventType.key === EventTypes.COMMENT.key)
            .value()

        return {
            label: 'New Things',
            count: keys(groupBy(notifications, 'thingId')).length
        }
    }

    getToDoCount() {
        return {
            label: 'To Dos',
            count: this.props.todoThings.length
        }
    }

    getFollowUpCount() {
        return {
            label: 'Follow Ups',
            count: this.props.followUpThings.length
        }
    }

    getEmailsCount() {
        return {
            label: 'Unread Emails',
            count: keys(groupBy(this.props.newEmails, 'payload.threadId')).length
        }
    }

    getAllCounts() {
        const styles = this.getStyles()
        const counts = reject([this.getCreatedCount(), this.getCommentsCount(), this.getToDoCount(), this.getFollowUpCount(), this.getEmailsCount()],
            {count: 0})

        if (!counts.length)
            return <span>Your workspace is clear, good job!</span>

        return (
            <span>
                You have:
                {
                    counts.map((countObj, index) =>
                        <span style={[styles.count, index < counts.length - 1 && styles.notLastCount]} key={index}>
                            {countObj.count} {countObj.label}
                        </span>
                    )
                }
            </span>
        )
    }

    getStyles() {
        return {
            topBar: {
                height: '75px',
                padding: '0 47px 0 55px',
                backgroundColor: styleVars.secondaryColor,
                color: 'white'
            },
            countSummary: {
                fontSize: '1.2em',
                fontWeight: 500,
                letterSpacing: '0.05em'
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
                <Flexbox name="count-summary" grow={1} style={styles.countSummary}>
                    <span>Greetings {currentUser.firstName}! </span>
                    {counts}
                </Flexbox>
                <Settings />
                <Flexbox>
                    <a href="/login/logout" style={{color: 'white'}}>Logout</a>
                </Flexbox>
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

module.exports = connect(mapStateToProps)(TopBar)