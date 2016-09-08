import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import classAutobind from 'class-autobind'
import DocumentTitle from 'react-document-title'
import {goBack} from 'react-router-redux'
import isEmpty from 'lodash/isEmpty'
import reject from 'lodash/reject'

import ThingPageActionsBar from './ThingPageActionsBar'
import MessagePanel from '../MessageBox/MessagePanel'
import FullItem, {FullItemSubject, FullItemStatus, FullItemActions, FullItemBox} from '../Full/FullItem'
import styleVars from '../style-vars'
import * as ThingPageActions from '../../actions/thing-page-actions'
import * as ThingHelper from '../../helpers/thing-helper'
import EventTypes from '../../../common/enums/event-types'
import ThingStatus from '../../../common/enums/thing-status'
import {InvalidationStatus} from '../../constants'

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
        dispatch(ThingPageActions.hideThingPage())
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

    getCircleColor() {
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

    render() {
        const {thing} = this.props
        return (
            <DocumentTitle title={this.getDocumentTitle()}>
                <FullItem messages={this.getAllComments()} close={this.close} isFetching={this.isFetching} isEmpty={this.isEmpty} 
                          circleColor={this.getCircleColor()}>
                    <FullItemSubject>
                        <span>{thing.subject}</span>
                    </FullItemSubject>
                    <FullItemStatus>
                        <span>({thing.payload ? thing.payload.status : ''})</span>
                    </FullItemStatus>
                    <FullItemActions>
                        <ThingPageActionsBar thing={thing} />
                    </FullItemActions>
                    <FullItemBox>
                        <MessagePanel />
                    </FullItemBox>
                </FullItem>
            </DocumentTitle>
        )
    }
}

FullThing.propTypes = {
    thing: PropTypes.object.isRequired,
    invalidationStatus: PropTypes.string.isRequired,
    currentUser: PropTypes.object.isRequired
}

function mapStateToProps(state) {
    return {
        thing: state.thingPage.thing,
        invalidationStatus: state.thingPage.invalidationStatus,
        currentUser: state.auth
    }
}

export default connect(mapStateToProps)(FullThing)