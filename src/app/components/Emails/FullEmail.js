import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import DocumentTitle from 'react-document-title'
import classAutobind from 'class-autobind'
import {goBack} from 'react-router-redux'
import isEmpty from 'lodash/isEmpty'

import MessagePanel from '../MessageBox/MessagePanel'
import FullItem, {FullItemSubject, FullItemBox} from '../Full/FullItem'
import * as EmailPageActions from '../../actions/email-page-actions'
import {InvalidationStatus} from '../../constants'

class FullEmail extends Component {
    constructor(props) {
        super(props)
        classAutobind(this, FullEmail.prototype)
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

    getDocumentTitle() {
        const {thread} = this.props

        const unreadComments = this.getUnreadComments()

        if (unreadComments.length > 0)
            return `Freection (${unreadComments.length}) - ${thread.subject}`

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

export default connect(mapStateToProps)(FullEmail)