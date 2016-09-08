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
import Page from '../UI/Page'
import Flexbox from '../UI/Flexbox'
import PreviewsContainer from '../Preview/PreviewsContainer'
import EmailPreviewItem from './EmailPreviewItem'
import styleVars from '../style-vars'

class UnreadEmails extends Component {
    constructor(props) {
        super(props)
        classAutobind(this, UnreadEmails.prototype)
    }

    getTitle() {
        // TODO: should we return the aggregated number instead?
        if (this.props.emails.length > 0)
            return `Freection (${this.props.emails.length}) - Unread Emails`

        return 'Freection - Unread Emails'
    }

    fetchUnreadEmails() {
        const {dispatch} = this.props
        dispatch(EmailActions.fetchUnread())
    }

    getEmailRows() {
        const aggregatedEmails = []

        const emailsByThreadId = groupBy(this.props.emails, 'payload.threadId')
        forOwn(emailsByThreadId, threadEmails => {
            const lastEmail = chain(threadEmails).sortBy('createdAt').head().clone().value()
            aggregatedEmails.push(merge(lastEmail, {
                entityId: lastEmail.payload.threadId,
                payload: {
                    emailUids: map(threadEmails, 'payload.uid')
                }
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

    getNoPreviews() {
        return {
            texts: [
                'No new emails.',
                'Hmm, sorry, we don\'t have a good joke for this part.'
            ],
            logoColor: styleVars.basePinkColor
        }
    }

    render() {
        const {invalidationStatus} = this.props

        return (
            <Page title={this.getTitle()}>
                <PreviewsContainer previewItems={this.getEmailRows()}
                                   fetchPreviews={this.fetchUnreadEmails}
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