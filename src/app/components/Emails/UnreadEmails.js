const React = require('react')
const {Component, PropTypes} = React
const {connect} = require('react-redux')
const DocumentTitle = require('react-document-title')
const classAutobind = require('class-autobind').default

const {chain} = require('lodash/core')
const groupBy = require('lodash/groupBy')
const orderBy = require('lodash/orderBy')
const forOwn = require('lodash/forOwn')
const merge = require('lodash/merge')
const clone = require('lodash/clone')
const map = require('lodash/map')

const EmailActions = require('../../actions/email-actions')

const PreviewsContainer = require('../Preview/PreviewsContainer')
const EmailPreviewItem = require('./EmailPreviewItem')

class UnreadEmails extends Component {
    constructor(props) {
        super(props)
        classAutobind(this)
    }

    getTitle() {
        // TODO: should we return the aggregated number instead?
        if (this.props.emails.length > 0)
            return `Freection (${this.props.emails.length}) - Unread Emails`
        else
            return 'Freection - Unread Emails'
    }

    fetchUnreadEmails() {
        const {dispatch} = this.props
        dispatch(EmailActions.fetchUnread())
    }

    getEmailRows() {
        let emailRows = []

        const emailsByThreadId = groupBy(this.props.emails, 'payload.threadId')
        forOwn(emailsByThreadId, (threadEmails) => {
            const lastEmail = chain(threadEmails).sortBy('createdAt').head().clone().value()
            emailRows.push(merge(lastEmail, {
                entityId: lastEmail.payload.threadId,
                payload: {
                    emailIds: map(threadEmails, 'id')
                }
            }))
        })

        return orderBy(emailRows, 'createdAt', 'desc').map(email =>
            <EmailPreviewItem email={email} currentUser={this.props.currentUser} key={email.id} />
        )
    }

    render() {
        const {invalidationStatus} = this.props

        return (
            <DocumentTitle title={this.getTitle()}>
                <PreviewsContainer previewItems={this.getEmailRows()}
                                   fetchPreviews={this.fetchUnreadEmails}
                                   noPreviewsText="There are no new emails"
                                   invalidationStatus={invalidationStatus} />
            </DocumentTitle>
        )
    }
}

UnreadEmails.propsTypes = {
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

module.exports = connect(mapStateToProps)(UnreadEmails)