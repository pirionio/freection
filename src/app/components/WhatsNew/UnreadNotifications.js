import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import classAutobind from 'class-autobind'
import useSheet from 'react-jss'
import classNames from 'classnames'
import isEmpty from 'lodash/isEmpty'
import toPairs from 'lodash/toPairs'
import {chain} from 'lodash/core'

import * as ThingHelper from '../../../common/helpers/thing-helper'
import Flexbox from '../UI/Flexbox'
import PreviewsContainer from '../Preview/PreviewsContainer'
import Placeholder from '../Preview/Placeholder'
import NotificationPreviewItem from './NotificationPreviewItem'
import GithubPreviewItem from './GithubPreviewItem'
import * as PreviewHelper from '../../helpers/preview-helper'
import * as WhatsNewActions from '../../actions/whats-new-actions'
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
        const aggregatedNotifications = ThingHelper.groupNotificationsByThing(notifications)
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

    getPlaceholder() {
        return (
            <Placeholder title="Zero Inbox!"
                         subTitle="Check this page when you want to be updated about new notifications on your tasks." />
        )
    }

    render () {
        const {invalidationStatus} = this.props

        return (
            <Flexbox name="unread-notifications-container" grow={1} container="column">
                <PreviewsContainer previewItems={this.getNotificationRows()}
                                   fetchPreviews={this.fetchWhatsNew}
                                   getPlaceholder={this.getPlaceholder}
                                   invalidationStatus={invalidationStatus}>
                    {this.props.children}
                </PreviewsContainer>
            </Flexbox>
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