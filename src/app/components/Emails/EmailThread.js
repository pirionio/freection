const React = require('react')
const {Component, PropTypes} = React
const {connect} = require('react-redux')
const DocumentTitle = require('react-document-title')
const dateFns = require('date-fns')
const {goBack} = require('react-router-redux')
const classAutobind = require('class-autobind').default

const isEmpty = require('lodash/isEmpty')

const MessagePanel = require('../MessageBox/MessagePanel')

const {FullItem, FullItemSubject, FullItemUser, FullItemDate, FullItemBox} = require('../Full/FullItem')
const TextTruncate = require('../UI/TextTruncate')

const EmailPageActions = require('../../actions/email-page-actions')
const {InvalidationStatus} = require('../../constants')

class EmailThread extends Component {
    constructor(props) {
        super(props)
        classAutobind(this, EmailThread.prototype)
    }

    componentDidMount() {
        const {dispatch, params} = this.props
        dispatch(EmailPageActions.getEmail(params.emailThreadId))
    }

    componentDidUpdate() {
        const {dispatch, params} = this.props
        dispatch(EmailPageActions.getEmail(params.emailThreadId))
    }

    componentWillUnmount() {
        const {dispatch} = this.props
        dispatch(EmailPageActions.hideEmailPage())
    }

    close() {
        const {dispatch} = this.props
        dispatch(goBack())
    }

    getUser() {
        const {thread} = this.props
        return thread && thread.creator ? thread.creator.displayName : ''
    }

    getDocumentTitle() {
        const {thread} = this.props

        const unreadComments = this.getUnreadComments()

        if (unreadComments.length > 0)
            return `Freection (${unreadComments.length}) - ${thread.subject}`
        else
            return `Freection - ${thread.subject}`
    }

    getAllMessages() {
        const {thread} = this.props
        return thread.messages || []
    }

    getUnreadComments() {
        const {thread} = this.props
        return thread.messages ?
            thread.messages.filter(message => !message.payload.isRead) :
            []
    }

    isFetching() {
        return this.props.invalidationStatus === InvalidationStatus.FETCHING
    }

    isEmpty() {
        return isEmpty(this.props.thread)
    }

    render() {
        const {thread} = this.props

        return (
            <DocumentTitle title={this.getDocumentTitle()}>
                <FullItem messages={this.getAllMessages()} close={this.close} isFetching={this.isFetching} isEmpty={this.isEmpty}>
                    <FullItemSubject>
                        <TextTruncate style={{fontWeight: 'bold'}}>{thread.subject}</TextTruncate>
                    </FullItemSubject>
                    <FullItemUser>
                        <span>{this.getUser()}</span>
                    </FullItemUser>
                    <FullItemDate>
                        <span>{dateFns.format(thread.createdAt, 'DD-MM-YYYY HH:mm')}</span>
                    </FullItemDate>
                    <FullItemBox>
                        <MessagePanel />
                    </FullItemBox>
                </FullItem>
            </DocumentTitle>
        )
    }
}

EmailThread.propTypes = {
    thread: PropTypes.object.isRequired,
    invalidationStatus: PropTypes.string.isRequired,
    currentUser: PropTypes.object.isRequired
}

function mapStateToProps(state) {
    return {
        thread: state.emailPage.thread,
        invalidationStatus: state.emailPage.invalidationStatus,
        currentUser: state.auth
    }
}

module.exports = connect(mapStateToProps)(EmailThread)