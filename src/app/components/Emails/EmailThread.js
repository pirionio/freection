const React = require('react')
const {Component, PropTypes} = React
const {connect} = require('react-redux')
const DocumentTitle = require('react-document-title')
const dateFns = require('date-fns')
const {goBack} = require('react-router-redux')

const isEmpty = require('lodash/isEmpty')
const find = require('lodash/find')
const includes = require('lodash/includes')

const CommentList = require('../Comment/CommentList')

const EmailPageActions = require('../../actions/email-page-actions')

class EmailThread extends Component {
    constructor(props) {
        super(props)
        this.close = this.close.bind(this)
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
            return `(${unreadComments.length}) ${thread.subject} - Freection`
        else
            return `${thread.subject} - Freection`
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

    render() {
        const {thread, isFetching} = this.props
        const comments = this.getAllComments()
        const createdAt = dateFns.format(thread.createdAt, 'DD-MM-YYYY HH:mm')

        if (isFetching) {
            return (
                <div className="thing-container">
                    <div className="thing-loading">
                        Loading thing, please wait.
                    </div>
                    <div className="thing-close">
                        <button onClick={this.close}>Back</button>
                    </div>
                </div>
            )
        }

        if (isEmpty(thread)) {
            return (
                <div className="thing-container">
                    <div className="thing-error">
                        We are sorry, the email could not be displayed!
                    </div>
                    <div className="thing-close">
                        <button onClick={this.close}>Back</button>
                    </div>
                </div>
            )
        }

        return (
            <DocumentTitle title={this.getTitle()}>
                <div className="thing-container">
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