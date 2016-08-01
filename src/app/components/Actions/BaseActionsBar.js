const React = require('react')
const {Component, PropTypes} = React
const {connect} = require('react-redux')

const ThingCommandActions = require('../../actions/thing-command-actions')
const Action = require('./Action')

class BaseActionsBar extends Component {
    constructor(props) {
        super(props)

        this.doThing = this.doThing.bind(this)
        this.markAsDone = this.markAsDone.bind(this)
        this.dismiss = this.dismiss.bind(this)
        this.cancel = this.cancel.bind(this)
        this.ping = this.ping.bind(this)
        this.close = this.close.bind(this)
        this.discardComments = this.discardComments.bind(this)
        this.discardPing = this.discardPing.bind(this)
        this.sendBack = this.sendBack.bind(this)
        this.cancelAck = this.cancelAck.bind(this)
    }

    getActions() {
        const {allowedActions} = this.props
        let actions = []

        if (allowedActions.doAction)
            actions.push(<Action label="Do" doFunc={this.doThing} key="action-Do" />)

        if (allowedActions.done)
            actions.push(<Action label="Done" doFunc={this.markAsDone} key="action-Done" />)

        if (allowedActions.dismiss)
            actions.push(<Action label="Dismiss" doFunc={this.dismiss} key="action-Dismiss" />)

        if (allowedActions.cancel)
            actions.push(<Action label="Cancel" doFunc={this.cancel} key="action-Cancel" />)

        if (allowedActions.ping)
            actions.push(<Action label="Ping" doFunc={this.ping} key="action-Ping" />)

        if (allowedActions.close)
            actions.push(<Action label="Close" doFunc={this.close} key="action-Close" />)

        if (allowedActions.discardComments)
            actions.push(<Action label="Discard" doFunc={this.discardComments} key="action-Discard" />)

        if (allowedActions.discardPing)
            actions.push(<Action label="Discard" doFunc={this.discardPing} key="action-Discard" />)

        if (allowedActions.sendBack)
            actions.push(<Action label="Send Back" doFunc={this.sendBack} key="action-SendBack" />)

        if (allowedActions.cancelAck)
            actions.push(<Action label="Stop doing" doFunc={this.cancelAck} key="action-StopDoing" />)

        return actions
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

    cancel() {
        const {dispatch, thing} = this.props
        dispatch(ThingCommandActions.cancel(thing))
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

    sendBack() {
        const {dispatch, thing} = this.props
        dispatch(ThingCommandActions.sendBack(thing))
    }

    cancelAck() {
        const {dispatch, thing} = this.props
        dispatch(ThingCommandActions.cancelAck(thing))
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

BaseActionsBar.propTypes = {
    currentUser: PropTypes.object.isRequired,
    thing: PropTypes.object.isRequired,
    notification: PropTypes.object,
    allowedActions: PropTypes.object
}

function mapStateToProps(state) {
    return {
        currentUser: state.auth
    }
}

module.exports = connect(mapStateToProps)(BaseActionsBar)