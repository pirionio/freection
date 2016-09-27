import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import classAutobind from 'class-autobind'
import useSheet from 'react-jss'
import classNames from 'classnames'
import groupBy from 'lodash/groupBy'
import first from 'lodash/first'
import last from 'lodash/last'
import merge from 'lodash/merge'
import reject from 'lodash/reject'
import forOwn from 'lodash/forOwn'
import clone from 'lodash/clone'
import isEmpty from 'lodash/isEmpty'
import toPairs from 'lodash/toPairs'
import {chain} from 'lodash/core'

import Flexbox from '../UI/Flexbox'
import Page from '../UI/Page'
import styleVars from '../style-vars'
import PreviewsContainer from '../Preview/PreviewsContainer'
import NotificationPreviewItem from './NotificationPreviewItem'
import GithubPreviewItem from './GithubPreviewItem'
import * as PreviewHelper from '../../helpers/preview-helper'
import * as WhatsNewActions from '../../actions/whats-new-actions'
import EventTypes from '../../../common/enums/event-types'
import EntityTypes from '../../../common/enums/entity-types'

class WhatsNew extends Component {
    constructor(props) {
        super(props)
        classAutobind(this, WhatsNew.prototype)
    }

    fetchWhatsNew() {
        const {dispatch} = this.props
        dispatch(WhatsNewActions.fetchWhatsNew())
    }

    getNotificationRows() {
        const {notifications} = this.props
        const notificationsByThing = groupBy(notifications, notification => notification.thing.id)

        const aggregatedNotifications = []

        // We want to aggregate notifications that belong to the very same thing. That's why we grouped them according to Thing.
        forOwn(notificationsByThing, thingNotifications => {
            const commentNotifications = chain(thingNotifications)
                .filter(notification => [EventTypes.CREATED.key, EventTypes.COMMENT.key, EventTypes.MENTIONED.key]
                    .includes(notification.eventType.key))
                .sortBy('createdAt')
                .value()
            const oldest = first(commentNotifications)
            const newest = last(commentNotifications)

            // Notice below how the createdAt field will be taken from the newest comment we found.
            // That's because if indeed many comments arrived, we'd like the final aggregated notification to be ordered among all other notifications
            // based on the last comment that arrived. The text, however, of the notification, will be that of the FIRST comment that arrived.
            if (oldest) {
                aggregatedNotifications.push(merge(clone(oldest), {
                    payload: {
                        newNotifications: commentNotifications
                    },
                    createdAt: newest ? newest.createdAt : oldest.createdAt
                }))
            }

            // Here we add the rest of the notifications.
            aggregatedNotifications.push(...reject(thingNotifications, notification =>
                [EventTypes.CREATED.key, EventTypes.COMMENT.key, EventTypes.MENTIONED.key].includes(notification.eventType.key)
            ))
        })

        if (!aggregatedNotifications || !aggregatedNotifications.length)
            return []

        return this.groupNotificationsByDate(aggregatedNotifications)
    }
    
    groupNotificationsByDate(aggregatedNotifications) {
        const {sheet: {classes}} = this.props

        const groupedNotifications = PreviewHelper.groupByDate(aggregatedNotifications, this.buildPreviewItem)

        return chain(toPairs(groupedNotifications))
            .filter(([, notifications]) => !isEmpty(notifications))
            .map(([groupTitle, notifications], index) => {
                const titleClass = classNames(classes.header, index === 0 && classes.first)
                return (
                    <Flexbox name={`container-${groupTitle}`} key={`container-${groupTitle}`}>
                        <Flexbox name="group-title" container="row" alignItems="center" className={titleClass}>
                            {groupTitle}
                        </Flexbox>
                        {notifications}
                    </Flexbox>
                )
            })
            .value()
    }

    buildPreviewItem(notification) {
        return notification.thing.type.key === EntityTypes.GITHUB.key ?
            <GithubPreviewItem notification={notification} key={notification.id} /> :
            <NotificationPreviewItem notification={notification} key={notification.id} />
    }

    getTitle() {
        // TODO: should we return the aggregated number instead?
        if (this.props.notifications.length > 0)
            return `Freection (${this.props.notifications.length}) - What's New?`

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
                                   invalidationStatus={invalidationStatus}>
                    {this.props.children}
                </PreviewsContainer>
            </Page>
        )
    }
}

const style = {
    header: {
        color: '#515151',
        textTransform: 'uppercase',
        marginTop: 26,
        marginBottom: 13,
        marginLeft: 1
    },
    first: {
        marginTop: 0
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

export default useSheet(connect(mapStateToProps)(WhatsNew), style)