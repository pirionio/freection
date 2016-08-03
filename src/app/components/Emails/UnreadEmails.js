const React = require('react')
const {Component, PropTypes} = React
const {connect} = require('react-redux')
const DocumentTitle = require('react-document-title')

const {chain} = require('lodash/core')
const groupBy = require('lodash/groupBy')
const sortBy = require('lodash/sortBy')
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

        this.fetchUnreadEmails = this.fetchUnreadEmails.bind(this)
        this.getEmailRows = this.getEmailRows.bind(this)
    }

    getTitle() {
        // TODO: should we return the aggregated number instead?
        if (this.props.emails.length > 0)
            return `Unread Emails (${this.props.emails.length}) - Freection`
        else
            return 'Unread Emails - Freection'
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

        return sortBy(emailRows, 'createdAt').map(email =>
            <EmailPreviewItem email={email} currentUser={this.props.currentUser} key={email.id} />
        )
    }

    render() {
        return (
            <DocumentTitle title={this.getTitle()}>
                <PreviewsContainer previewItems={this.getEmailRows()}
                                   fetchPreviews={this.fetchUnreadEmails}
                                   noPreviewsText="There are no new emails" />
            </DocumentTitle>
        )
    }
}

UnreadEmails.propsTypes = {
    emails: PropTypes.array.isRequired,
    currentUser: PropTypes.object.isRequired
}

function mapStateToProps(state) {
    return {
        emails: state.unreadEmails.emails,
        currentUser: state.auth
    }
}

module.exports = connect(mapStateToProps)(UnreadEmails)