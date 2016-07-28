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
const Action = require('../Messages/Action')

const ThingCommandActions = require('../../actions/thing-command-actions')
const ThingPageActions = require('../../actions/thing-page-actions')

const ThingStatus = require('../../../common/enums/thing-status')
const EventTypes = require('../../../common/enums/event-types')

class Thing extends Component {
    constructor(props) {
        super(props)
        this.close = this.close.bind(this)
        this.doThing = this.doThing.bind(this)
        this.dismissThing = this.dismissThing.bind(this)
        this.closeThing = this.closeThing.bind(this)
        this.abortThing = this.abortThing.bind(this)
        this.markThingAsDone = this.markThingAsDone.bind(this)
        this.pingThing = this.pingThing.bind(this)
    }

    componentWillMount() {
        const {dispatch, params} = this.props
        dispatch(ThingPageActions.get(params.thingId))
    }

    componentWillUnmount() {
        const {dispatch} = this.props
        dispatch(ThingPageActions.hide())
    }

    close() {
        const {dispatch} = this.props
        dispatch(goBack())
    }

    getThingReferencer() {
        const {thing, currentUser} = this.props

        if (thing.creator.email === currentUser.email) {
            return thing.to.email
        }

        return thing.creator.email
    }

    getActions() {
        const {thing} = this.props

        let actions = []

        if (thing.payload.status === ThingStatus.NEW.key && this.isCurrentUserTheTo()) {
            actions.push(
                <Action label="Do" doFunc={this.doThing} key="action-Do" />
            )
        }

        if ((thing.payload.status === ThingStatus.NEW.key ||
            thing.payload.status === ThingStatus.INPROGRESS.key) && this.isCurrentUserTheTo()) {
            actions.push(
                <Action label="Dismiss" doFunc={this.dismissThing} key="action-Dismiss" />
            )
        }

        if ((thing.payload.status === ThingStatus.INPROGRESS.key || thing.payload.status === ThingStatus.NEW.key) && this.isCurrentUserTheTo()) {
            actions.push(
                <Action label="Done" doFunc={this.markThingAsDone} key="action-Done" />
            )
        }

        if (thing.payload.status === ThingStatus.DONE.key && this.isCurrentUserTheCreator()) {
            actions.push(
                <Action label="Close" doFunc={this.closeThing} key="action-Close" />
            )
        }

        if ((thing.payload.status == ThingStatus.INPROGRESS.key ||
            thing.payload.status == ThingStatus.NEW.key) && this.isCurrentUserTheCreator()) {
            actions.push(
                <Action label="Abort" doFunc={this.abortThing} key="action-Abort" />
            )
        }

        if (thing.payload.status === ThingStatus.INPROGRESS.key && this.isCurrentUserTheCreator()) {
            actions.push(
                <Action label="Ping" doFunc={this.pingThing} key="action-Ping" />
            )
        }

        return actions
    }

    doThing() {
        const {dispatch, thing} = this.props
        dispatch(ThingCommandActions.doThing(thing))
    }

    dismissThing() {
        const {dispatch, thing} = this.props
        dispatch(ThingCommandActions.dismiss(thing))
    }

    markThingAsDone() {
        const {dispatch, thing} = this.props
        dispatch(ThingCommandActions.markAsDone(thing))
    }

    closeThing() {
        const {dispatch, thing} = this.props
        dispatch(ThingCommandActions.close(thing))
    }

    abortThing() {
        const {dispatch, thing} = this.props
        dispatch(ThingCommandActions.abort(thing))
    }

    pingThing() {
        const {dispatch, thing} = this.props
        dispatch(ThingCommandActions.ping(thing))
    }

    isCurrentUserTheCreator() {
        return this.props.currentUser.id === this.props.thing.creator.id
    }

    isCurrentUserTheTo() {
        return this.props.currentUser.email === this.props.thing.to.email
    }

    getTitle() {
        const {thing} = this.props

        const unreadComments = this.getUnreadComments()

        if (unreadComments.length > 0)
            return `(${unreadComments.length}) ${thing.subject} - Freection`
        else
            return `${thing.subject} - Freection`
    }

    getAllComments() {
        const {thing} = this.props
        return thing.events ?
            thing.events.filter(event => includes([EventTypes.COMMENT.key, EventTypes.PING.key], event.eventType.key)) :
            []
    }

    getUnreadComments() {
        const {thing} = this.props
        return thing.events ?
            thing.events.filter(event => includes([EventTypes.COMMENT.key, EventTypes.PING.key], event.eventType.key) && !event.payload.isRead) :
            []
    }

    render() {
        const {thing, isFetching} = this.props
        const comments = this.getAllComments()
        const createdAt = dateFns.format(thing.createdAt, 'DD-MM-YYYY HH:mm')

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

        if (isEmpty(thing)) {
            return (
                <div className="thing-container">
                    <div className="thing-error">
                        We are sorry, the thing could not be displayed!
                    </div>
                    <div className="thing-close">
                        <button onClick={this.close}>Back</button>
                    </div>
                </div>
            )
        }

        const actions = this.getActions()

        return (
            <DocumentTitle title={this.getTitle()}>
                <div className="thing-container">
                    <div className="thing-header">
                        <div className="thing-title">
                            <div className="thing-subject">
                                {thing.subject}
                            </div>
                            <div className="thing-status">
                                ({thing.payload ? thing.payload.status : ''})
                            </div>
                            <div className="thing-close">
                                <button onClick={this.close}>Back</button>
                            </div>
                            <div className="thing-actions">
                                {actions}
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

Thing.propTypes = {
    thing: PropTypes.object.isRequired,
    isFetching: PropTypes.bool.isRequired,
    currentUser: PropTypes.object.isRequired
}

function mapStateToProps(state) {
    return {
        thing: state.thingPage.thing,
        isFetching: state.thingPage.isFetching,
        currentUser: state.auth
    }
}

module.exports = connect(mapStateToProps)(Thing)