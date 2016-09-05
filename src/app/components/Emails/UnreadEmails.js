const React = require('react')
const {Component, PropTypes} = React
const {connect} = require('react-redux')
const classAutobind = require('class-autobind').default
const useSheet = require('react-jss').default
const classNames = require('classnames')

const {chain} = require('lodash/core')
const groupBy = require('lodash/groupBy')
const orderBy = require('lodash/orderBy')
const forOwn = require('lodash/forOwn')
const merge = require('lodash/merge')
const clone = require('lodash/clone')
const map = require('lodash/map')
const isEmpty = require('lodash/isEmpty')
const toPairs = require('lodash/toPairs')

const PreviewHelper = require('../../helpers/preview-helper')
const EmailActions = require('../../actions/email-actions')

const Page = require('../UI/Page')
const Flexbox = require('../UI/Flexbox')
const PreviewsContainer = require('../Preview/PreviewsContainer')
const EmailPreviewItem = require('./EmailPreviewItem')
const styleVars = require('../style-vars')
const FullEmail = require('../Emails/FullEmail')

class UnreadEmails extends Component {
    constructor(props) {
        super(props)
        classAutobind(this, UnreadEmails.prototype)
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
        let aggregatedEmails = []

        const emailsByThreadId = groupBy(this.props.emails, 'payload.threadId')
        forOwn(emailsByThreadId, (threadEmails) => {
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
            .filter(([groupTitle, emails]) => !isEmpty(emails))
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

module.exports = useSheet(connect(mapStateToProps)(UnreadEmails), style)