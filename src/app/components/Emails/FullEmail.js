const React = require('react')
const {Component, PropTypes} = React
const {connect} = require('react-redux')
const DocumentTitle = require('react-document-title')
const classAutobind = require('class-autobind').default

const isEmpty = require('lodash/isEmpty')

const MessagePanel = require('../MessageBox/MessagePanel')

const {FullItem, FullItemSubject, FullItemBox} = require('../Full/FullItem')
const TextTruncate = require('../UI/TextTruncate')

const EmailPageActions = require('../../actions/email-page-actions')
const {InvalidationStatus} = require('../../constants')

class FullEmail extends Component {
    constructor(props) {
        super(props)
        classAutobind(this, FullEmail.prototype)
    }

    componentDidMount() {
        const {dispatch, thread} = this.props
        dispatch(EmailPageActions.getEmail(thread.payload.threadId))
    }

    componentDidUpdate() {
        const {dispatch, thread} = this.props
        dispatch(EmailPageActions.getEmail(thread.payload.threadId))
    }

    componentWillUnmount() {
        const {dispatch} = this.props
        dispatch(EmailPageActions.hideEmailPage())
    }

    close() {
        const {dispatch} = this.props
        dispatch(EmailPageActions.hideEmailPage())
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
                        <span>{thread.subject}</span>
                    </FullItemSubject>
                    <FullItemBox>
                        <MessagePanel />
                    </FullItemBox>
                </FullItem>
            </DocumentTitle>
        )
    }
}

FullEmail.propTypes = {
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

module.exports = connect(mapStateToProps)(FullEmail)