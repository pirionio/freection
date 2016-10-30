import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import classAutobind from 'class-autobind'
import useSheet from 'react-jss'
import classNames from 'classnames'
import {chain} from 'lodash/core'
import groupBy from 'lodash/groupBy'
import forOwn from 'lodash/forOwn'
import merge from 'lodash/merge'
import map from 'lodash/map'
import isEmpty from 'lodash/isEmpty'
import toPairs from 'lodash/toPairs'

import * as PreviewHelper from '../../helpers/preview-helper'
import * as EmailActions from '../../actions/email-actions'
import Flexbox from '../UI/Flexbox'
import PreviewsContainer from '../Preview/PreviewsContainer'
import EmailPreviewItem from './EmailPreviewItem'

class UnreadEmails extends Component {
    constructor(props) {
        super(props)
        classAutobind(this, UnreadEmails.prototype)
    }

    fetchUnreadEmails() {
        const {dispatch} = this.props
        dispatch(EmailActions.fetchUnread())
    }

    getEmailRows() {
        const aggregatedEmails = []

        const emailsByThreadId = groupBy(this.props.emails, 'payload.threadId')
        forOwn(emailsByThreadId, threadEmails => {
            const oldestEmail = chain(threadEmails).sortBy('createdAt').first().clone().value()
            const newestEmail = chain(threadEmails).sortBy('createdAt').last().clone().value()
            aggregatedEmails.push(merge(oldestEmail, {
                payload: {
                    emailUids: map(threadEmails, 'payload.uid')
                },
                createdAt: newestEmail ? newestEmail.createdAt : oldestEmail.createdAt
            }))
        })

        if (!aggregatedEmails|| !aggregatedEmails.length)
            return []

        return this.groupEmailsByDate(aggregatedEmails)
    }

    groupEmailsByDate(aggregatedEmails) {
        const {sheet: {classes}} = this.props

        const groupedEmails = PreviewHelper.groupByDate(aggregatedEmails, this.buildPreviewItem)

        const emailsToShow = chain(toPairs(groupedEmails))
            .filter(([, emails]) => !isEmpty(emails))
            .map(([groupTitle, emails], index) => {
                const titleClass = classNames(classes.header, index === 0 && classes.first)
                return (
                    <Flexbox name={`container-${groupTitle}`} key={`container-${groupTitle}`}>
                        <Flexbox name="group-title" container="row" alignItems="center" className={titleClass}>
                            {groupTitle}
                        </Flexbox>
                        {emails}
                    </Flexbox>
                )
            })
            .value()

        return (
            <Flexbox container="column" grow={1}>
                {emailsToShow}
            </Flexbox>
        )

    }

    buildPreviewItem(email) {
        return <EmailPreviewItem email={email} currentUser={this.props.currentUser} key={email.id} />
    }

    render() {
        const {invalidationStatus} = this.props

        return (
            <Flexbox name="unread-emails-container" grow={1} container="column">
                <PreviewsContainer previewItems={this.getEmailRows()}
                                   fetchPreviews={this.fetchUnreadEmails}
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

UnreadEmails.propTypes = {
    emails: PropTypes.array.isRequired,
    currentUser: PropTypes.object.isRequired,
    invalidationStatus: PropTypes.string.isRequired
}

function mapStateToProps(state) {
    return {
        emails: state.unreadEmails.emails,
        invalidationStatus: state.unreadEmails.invalidationStatus,
        currentUser: state.auth
    }
}

export default useSheet(connect(mapStateToProps)(UnreadEmails), style)