import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import classAutobind from 'class-autobind'
import DocumentTitle from 'react-document-title'
import useSheet from 'react-jss'
import {goBack} from 'react-router-redux'
import isEmpty from 'lodash/isEmpty'
import reject from 'lodash/reject'

import CommandsBar from '../Commands/CommandsBar'
import MessagePanel from '../MessageBox/MessagePanel'
import FullItem, {FullItemSubject, FullItemUser, FullItemStatus, FullItemActions, FullItemBox} from '../Full/FullItem'
import styleVars from '../style-vars'
import * as ThingPageActions from '../../actions/thing-page-actions'
import * as ThingHelper from '../../../common/helpers/thing-helper'
import EventTypes from '../../../common/enums/event-types'
import ThingStatus from '../../../common/enums/thing-status'
import {InvalidationStatus} from '../../constants'
import ThingCommandActionTypes from '../../actions/types/thing-command-action-types.js'
import * as MessageBoxActions from '../../actions/message-box-actions'
import MessageTypes from '../../../common/enums/message-types'

class FullThing extends Component {
    constructor(props) {
        super(props)
        classAutobind(this, FullThing.prototype)
    }

    componentDidMount() {
        const {dispatch, params} = this.props
        dispatch(ThingPageActions.getThing(params.thingId))
    }

    componentWillUnmount() {
        const {dispatch} = this.props
        dispatch(ThingPageActions.hide())
    }

    componentWillReceiveProps() {
        // Will fetch messages only if needed
        const {dispatch, params} = this.props
        dispatch(ThingPageActions.getThing(params.thingId))
    }

    close() {
        const {dispatch} = this.props
        dispatch(goBack())
    }

    getDocumentTitle() {
        const {thing} = this.props

        const unreadComments = this.getUnreadComments()

        if (unreadComments.length > 0)
            return `Freection (${unreadComments.length}) - ${thing.subject}`

        return `Freection - ${thing.subject}`
    }

    getAllComments() {
        const {thing} = this.props

        // Filter out CREATED events that have no text - since we allow creating a new Thing with no body at all.
        return thing.events ?
            reject(ThingHelper.getAllMessages(thing), message => !message.payload.text && message.eventType.key !== EventTypes.PING.key) :
            []
    }

    getUnreadComments() {
        const {thing} = this.props
        return thing.events ? ThingHelper.getUnreadMessages(thing) : []
    }

    getStatusColor() {
        const {thing} = this.props

        // There might not yet be a thing prop when this function is invoked.
        // That happens because the component is shown before the fetch call is invoked and returns.
        if (!thing || !thing.payload)
            return 'black'

        switch (thing.payload.status) {
            case ThingStatus.NEW.key:
            case ThingStatus.REOPENED.key:
                return styleVars.blueCircleColor
            case ThingStatus.INPROGRESS.key:
                return styleVars.yellowCircleColor
            case ThingStatus.DISMISS.key:
                return styleVars.redCircleColor
            case ThingStatus.DONE.key:
                return styleVars.greenCircleColor
            case ThingStatus.CLOSE.key:
                return styleVars.greyCircleColor
            default:
                return 'black'
        }
    }

    isFetching() {
        return this.props.invalidationStatus === InvalidationStatus.FETCHING
    }

    isEmpty() {
        return isEmpty(this.props.thing)
    }

    requireText(command, sendAction) {
        const {dispatch, thing} = this.props

        const messageBoxTitle =
            command === ThingCommandActionTypes.MARK_AS_DONE ? 'Done' :
            command === ThingCommandActionTypes.DISMISS ? 'Dismiss' :
            command === ThingCommandActionTypes.SEND_BACK ? 'Send Back' :
            command === ThingCommandActionTypes.CLOSE ? 'Close' : ''

        dispatch(MessageBoxActions.newMessageBox(MessageTypes.THING_ACTION, thing, sendAction, messageBoxTitle))
    }

    render() {
        const {thing, commands, ongoingAction, sheet: {classes}} = this.props
        return (
            <DocumentTitle title={this.getDocumentTitle()}>
                <FullItem messages={this.getAllComments()} close={this.close} isFetching={this.isFetching} isEmpty={this.isEmpty} 
                          statusColor={this.getStatusColor()}>
                    <FullItemSubject>
                        <span>{thing.subject}</span>
                    </FullItemSubject>
                    <FullItemStatus>
                        <span>{thing.payload ? ThingStatus[thing.payload.status].label : ''}</span>
                    </FullItemStatus>
                    <FullItemUser>
                        <span>by {thing.creator ? thing.creator.displayName : ''}</span>
                    </FullItemUser>
                    <FullItemActions>
                        <CommandsBar thing={thing}
                                     commands={commands}
                                     requireTextFunc={this.requireText}
                                     supportRollover={false}
                                     disabled={ongoingAction}
                                     className={classes.commandsBar} />
                    </FullItemActions>
                    <FullItemBox>
                        <MessagePanel />
                    </FullItemBox>
                </FullItem>
            </DocumentTitle>
        )
    }
}

const styles = {
    commandsBar: {
        '& .js-button': {
            minWidth: 90,
            height: 30,
            fontSize: '0.857em',
            letterSpacing: '0.05em'
        }
    }
}

FullThing.propTypes = {
    thing: PropTypes.object.isRequired,
    commands: PropTypes.array.isRequired,
    ongoingAction: PropTypes.bool.isRequired,
    invalidationStatus: PropTypes.string.isRequired,
    currentUser: PropTypes.object.isRequired
}

function mapStateToProps(state) {
    return {
        thing: state.thingPage.thing,
        commands: state.thingPage.commands,
        invalidationStatus: state.thingPage.invalidationStatus,
        ongoingAction: state.thingPage.ongoingAction,
        currentUser: state.auth
    }
}

export default useSheet(connect(mapStateToProps)(FullThing), styles)