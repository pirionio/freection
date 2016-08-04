const React = require('react')
const {Component, PropTypes} = React
const {connect} = require('react-redux')
const DocumentTitle = require('react-document-title')
const Delay = require('react-delay')
const dateFns = require('date-fns')
const {goBack} = require('react-router-redux')
const classAutobind = require('class-autobind').default

const isEmpty = require('lodash/isEmpty')

const CommentList = require('../Comment/CommentList')

const EmailPageActions = require('../../actions/email-page-actions')

const {GeneralConstants} = require('../../constants')

class EmailThread extends Component {
    constructor(props) {
        super(props)
        classAutobind(this)
    }

    componentWillMount() {
        const {dispatch, params} = this.props
        dispatch(EmailPageActions.get(params.emailThreadId))
    }

    componentWillUnmount() {
        const {dispatch} = this.props
        dispatch(EmailPageActions.hide())
    }

    close() {
        const {dispatch} = this.props
        dispatch(goBack())
    }

    getThingReferencer() {
        const {thread} = this.props
        return thread.creator.email
    }

    getTitle() {
        const {thread} = this.props

        const unreadComments = this.getUnreadComments()

        if (unreadComments.length > 0)
            return `Freection (${unreadComments.length}) - ${thread.subject}`
        else
            return `Freection - ${thread.subject}`
    }

    getAllComments() {
        const {thread} = this.props
        return thread.messages
    }

    getUnreadComments() {
        const {thread} = this.props
        return thread.messages ?
            thread.messages.filter(message => !message.payload.isRead) :
            []
    }

    renderFetching() {
        return (
            <div className="thing-content">
                <Delay wait={GeneralConstants.FETCHING_DELAY_MILLIS}>
                    <div className="thing-loading">
                        Loading thing, please wait.
                    </div>
                </Delay>
                <div className="thing-close">
                    <button onClick={this.close}>Back</button>
                </div>
            </div>
        )
    }

    renderError() {
        return (
            <div className="thing-content">
                <div className="thing-error">
                    We are sorry, the email could not be displayed!
                </div>
                <div className="thing-close">
                    <button onClick={this.close}>Back</button>
                </div>
            </div>
        )
    }

    renderContent() {
        const {thread} = this.props
        const comments = this.getAllComments()
        const createdAt = dateFns.format(thread.createdAt, 'DD-MM-YYYY HH:mm')

        return (
            <div className="thing-content">
                <div className="thing-header">
                    <div className="thing-title">
                        <div className="thing-subject">
                            {thread.subject}
                        </div>
                        <div className="thing-status">
                            ({thread.payload ? thread.payload.status : ''})
                        </div>
                        <div className="thing-close">
                            <button onClick={this.close}>Back</button>
                        </div>
                    </div>
                    <div className="thing-subtitle">
                        <div className="thing-referencer">
                            {this.getThingReferencer()}
                        </div>
                        <div className="thing-creation-time">
                            {createdAt}
                        </div>
                    </div>
                </div>
                <div className="thing-body-container">
                    <div className="thing-body-content">
                        <CommentList comments={comments} />
                    </div>
                </div>
            </div>
        )
    }

    render() {
        const {thread, isFetching} = this.props

        let content
        if (isFetching)
            content = this.renderFetching()
        else if (isEmpty(thread))
            content = this.renderError()
        else
            content = this.renderContent()

        return (
            <DocumentTitle title={this.getTitle()}>
                <div className="thing-container">
                    {content}
                </div>
            </DocumentTitle>
        )
    }
}

EmailThread.propTypes = {
    thread: PropTypes.object.isRequired,
    isFetching: PropTypes.bool.isRequired,
    currentUser: PropTypes.object.isRequired
}

function mapStateToProps(state) {
    return {
        thread: state.emailPage.thread,
        isFetching: state.emailPage.isFetching,
        currentUser: state.auth
    }
}

module.exports = connect(mapStateToProps)(EmailThread)