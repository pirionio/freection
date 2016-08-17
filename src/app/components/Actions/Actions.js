const React = require('react')

const ThingCommandActions = require('../../actions/thing-command-actions')
const EmailCommandActions = require('../../actions/email-command-actions')
const Action = require('./Action')
const ThingStatus = require('../../../common/enums/thing-status')
const EventTypes = require('../../../common/enums/event-types')

function DoAction(thing, currentUser, disabled, style) {
    return {
        component: <Action label="Do" doFunc={ThingCommandActions.doThing} item={thing} disabled={disabled} key="action-Do"  style={style} />,
        show: currentUser && currentUser.id === thing.to.id &&
            [ThingStatus.NEW.key, ThingStatus.REOPENED.key].includes(thing.payload.status)
    }
}

function DoneAction(thing, currentUser, disabled, style) {
    return {
        component: <Action label="Done" doFunc={ThingCommandActions.markAsDone} item={thing} disabled={disabled} key="action-Done" style={style} />,
        show: currentUser.id === thing.to.id &&
            [ThingStatus.NEW.key, ThingStatus.INPROGRESS.key, ThingStatus.REOPENED.key].includes(thing.payload.status)
    }
}

function DismissAction(thing, currentUser, options={}) {
    return {
        component: <Action label="Dismiss" doFunc={ThingCommandActions.dismiss} preDoFunc={options.preDoFunc}
                           item={thing} disabled={options.disabled} key="action-Dismiss" style={options.style} />,
        show: currentUser && currentUser.id === thing.to.id &&
            [ThingStatus.NEW.key, ThingStatus.INPROGRESS.key, ThingStatus.REOPENED.key].includes(thing.payload.status) &&
            !thing.isSelf
    }
}

function CloseAction(thing, currentUser, disabled, style) {
    return {
        component: <Action label="Close" doFunc={ThingCommandActions.close} item={thing} disabled={disabled} key="action-Close" style={style} />,
        show: currentUser && currentUser.id === thing.creator.id &&
            [ThingStatus.DONE.key, ThingStatus.DISMISS.key, ThingStatus.NEW.key, ThingStatus.REOPENED.key, ThingStatus.INPROGRESS.key].includes(thing.payload.status)
    }
}

function SendBackAction(thing, currentUser, disabled, style) {
    return {
        component: <Action label="SendBack" doFunc={ThingCommandActions.sendBack} item={thing} disabled={disabled} key="action-SendBack" style={style} />,
        show: currentUser.id === thing.creator.id &&
            [ThingStatus.DONE.key, ThingStatus.DISMISS.key].includes(thing.payload.status)
    }
}

function PingAction(thing, currentUser, disabled, style) {
    return {
        component: <Action label="Ping" doFunc={ThingCommandActions.ping} item={thing} disabled={disabled} key="action-Ping" style={style} />,
        show: currentUser.id === thing.creator.id &&
            [ThingStatus.INPROGRESS.key].includes(thing.payload.status) &&
            !thing.isSelf
    }
}

function PongAction(thing, currentUser, options={}) {
    return {
        component: <Action label="Pong" doFunc={ThingCommandActions.pong} item={thing} preDoFunc={options.preDoFunc}
                           disabled={options.disabled} key="action-Pong" style={options.style} />,
        show: currentUser.id !== thing.creator.id &&
            [ThingStatus.INPROGRESS.key].includes(thing.payload.status) &&
            !thing.isSelf
    }
}

function DiscardCommentsAction(notification, style) {
    return {
        component: <Action label="Discard" doFunc={ThingCommandActions.discardComments} item={notification} key="action-Discard" style={style} />,
        show: notification.eventType.key === EventTypes.COMMENT.key
    }
}

function DiscardPingAction(notification, style) {
    return {
        component: <Action label="Discard" doFunc={ThingCommandActions.discardPing} item={notification} key="action-Discard" style={style} />,
        show: notification.eventType.key === EventTypes.PING.key
    }
}

function DiscardPongAction(notification, style) {
    return {
        component: <Action label="Discard" doFunc={ThingCommandActions.discardPong} item={notification} key="action-Discard" style={style} />,
        show: notification.eventType.key === EventTypes.PONG.key
    }
}

function CancelAckAction(notification, style) {
    return {
        component: <Action label="Stop doing" doFunc={ThingCommandActions.cancelAck} item={notification.thing} key="action-StopDoing" style={style} />,
        show: notification.eventType.key === EventTypes.CLOSED.key
    }
}

function DiscardEmails(emailUids, style) {
    return {
        component: <Action label="Discard" doFunc={EmailCommandActions.markAsRead} item={emailUids} key="action-Discard" style={style} />,
        show: true
    }
}

function DoEmail(email, currentUser, style) {
    return {
        component: <Action label="Do" item={email.entityId} doFunc={EmailCommandActions.doEmail} key="action-do-email" style={style} />,
        show: email.creator.id !== currentUser.email
    }
}

module.exports = {
    DoAction,
    DoneAction,
    DismissAction,
    CloseAction,
    PingAction,
    PongAction,
    SendBackAction,
    DiscardCommentsAction,
    DiscardPingAction,
    DiscardPongAction,
    CancelAckAction,
    DiscardEmails,
    DoEmail
}