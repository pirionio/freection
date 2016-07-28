const React = require('react')
const {Component, PropTypes} = React
const {connect} = require('react-redux')

const includes = require('lodash/includes')

const ThingCommandActions = require('../../actions/thing-command-actions')
const EventTypes = require('../../../common/enums/event-types')
const ThingStatus = require('../../../common/enums/thing-status')

const Action = require('./Action')

class ActionsBar extends Component {
    constructor(props) {
        super(props)

        this.doThing = this.doThing.bind(this)
        this.markAsDone = this.markAsDone.bind(this)
        this.dismiss = this.dismiss.bind(this)
        this.abort = this.abort.bind(this)
        this.ping = this.ping.bind(this)
        this.close = this.close.bind(this)
        this.discardComments = this.discardComments.bind(this)
        this.discardPing = this.discardPing.bind(this)

        this.showDo = this.showDo.bind(this)
        this.showDone = this.showDone.bind(this)
        this.showDismiss = this.showDismiss.bind(this)
        this.showAbort = this.showAbort.bind(this)
        this.showPing = this.showPing.bind(this)
        this.showClose = this.showClose.bind(this)
        this.showDiscardComments = this.showDiscardComments.bind(this)
        this.showDiscardPing = this.showDiscardPing.bind(this)
    }

    getActions() {
        let actions = []

        if (this.showDo())
            actions.push(<Action label="Do" doFunc={this.doThing} key="action-Do" />)

        if (this.showDone())
            actions.push(<Action label="Done" doFunc={this.markAsDone} key="action-Done" />)
        //
        if (this.showDismiss())
            actions.push(<Action label="Dismiss" doFunc={this.dismiss} key="action-Dismiss" />)

        if (this.showAbort())
            actions.push(<Action label="Abort" doFunc={this.abort} key="action-Abort" />)

        if (this.showPing())
            actions.push(<Action label="Ping" doFunc={this.ping} key="action-Ping" />)

        if (this.showClose())
            actions.push(<Action label="Close" doFunc={this.close} key="action-Close" />)

        if (this.showDiscardComments())
            actions.push(<Action label="Discard" doFunc={this.discardComments} key="action-Discard" />)

        if (this.showDiscardPing())
            actions.push(<Action label="Discard" doFunc={this.discardPing} key="action-Discard" />)

        return actions
    }

    showDo() {
        const {thing, notification, currentUser} = this.props
        return currentUser.id === thing.to.id &&
            includes([ThingStatus.NEW.key], thing.payload.status) &&
            (notification ? includes([EventTypes.CREATED.key], notification.eventType.key) : true)
    }

    showDone() {
        const {thing, notification, currentUser} = this.props
        return currentUser.id === thing.to.id &&
            includes([ThingStatus.NEW.key, ThingStatus.INPROGRESS.key], thing.payload.status) &&
            (notification ? includes([EventTypes.CREATED.key], notification.eventType.key) : true)
    }

    showDismiss() {
        const {thing, notification, currentUser} = this.props
        return currentUser.id === thing.to.id &&
            includes([ThingStatus.NEW.key, ThingStatus.INPROGRESS.key], thing.payload.status) &&
            (notification ? includes([EventTypes.CREATED.key], notification.eventType.key): true) &&
            !thing.isSelf
    }

    showClose() {
        const {thing, notification, currentUser} = this.props
        return currentUser.id === thing.creator.id &&
            includes([ThingStatus.DONE.key, ThingStatus.DISMISS.key], thing.payload.status) &&
            (notification ? includes([EventTypes.DONE.key, EventTypes.DISMISSED.key], notification.eventType.key) : true)
    }

    showAbort() {
        const {thing, currentUser, abort} = this.props
        return currentUser.id === thing.creator.id &&
            includes([ThingStatus.NEW.key, ThingStatus.INPROGRESS.key], thing.payload.status) &&
            abort
    }

    showPing() {
        const {thing, currentUser, ping} = this.props
        return currentUser.id === thing.creator.id &&
            includes([ThingStatus.INPROGRESS.key], thing.payload.status) &&
            ping &&
            !thing.isSelf
    }

    showDiscardComments() {
        const {notification} = this.props
        return notification && notification.eventType.key === EventTypes.COMMENT.key
    }

    showDiscardPing() {
        const {notification} = this.props
        return notification && notification.eventType.key === EventTypes.PING.key
    }

    doThing() {
        const {dispatch, thing} = this.props
        dispatch(ThingCommandActions.doThing(thing))
    }

    markAsDone() {
        const {dispatch, thing} = this.props
        dispatch(ThingCommandActions.markAsDone(thing))
    }

    dismiss() {
        const {dispatch, thing} = this.props
        dispatch(ThingCommandActions.dismiss(thing))
    }

    close() {
        const {dispatch, thing} = this.props
        dispatch(ThingCommandActions.close(thing))
    }

    abort() {
        const {dispatch, thing} = this.props
        dispatch(ThingCommandActions.abort(thing))
    }

    ping() {
        const {dispatch, thing} = this.props
        dispatch(ThingCommandActions.ping(thing))
    }
    
    discardComments() {
        const {dispatch, notification, currentUser} = this.props
        dispatch(ThingCommandActions.discardComments(notification, currentUser))
    }

    discardPing() {
        const {dispatch, notification} = this.props
        dispatch(ThingCommandActions.discardPing(notification))
    }

    render() {
        const actions = this.getActions()
        return (
            <div className="actions-bar">
                {actions}
            </div>
        )
    }
}

ActionsBar.propTypes = {
    currentUser: PropTypes.object.isRequired,
    thing: PropTypes.object.isRequired,
    notification: PropTypes.object,
    ping: PropTypes.bool,
    abort: PropTypes.bool
}

ActionsBar.defaultProps = {
    ping: true,
    abort: true
}

function mapStateToProps(state) {
    return {
        currentUser: state.auth
    }
}

module.exports = connect(mapStateToProps)(ActionsBar)