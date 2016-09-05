const React = require('react')

const ThingCommandActions = require('../../actions/thing-command-actions')
const EmailCommandActions = require('../../actions/email-command-actions')
const Action = require('./Action')
import ThingStatus from '../../../common/enums/thing-status'
import EventTypes from '../../../common/enums/event-types'

function DoAction(thing, currentUser, disabled) {
    return {
        component: <Action label="Do" doFunc={ThingCommandActions.doThing} item={thing} disabled={disabled} key="action-Do" />,
        show: currentUser && currentUser.id === thing.to.id &&
            [ThingStatus.NEW.key, ThingStatus.REOPENED.key].includes(thing.payload.status)
    }
}

function DoneAction(thing, currentUser, options={}) {
    return {
        component: <Action label="Done" doFunc={ThingCommandActions.markAsDone} preDoFunc={options.preDoFunc}
                           item={thing} disabled={options.disabled} key="action-Done" />,
        show: currentUser.id === thing.to.id &&
            [ThingStatus.NEW.key, ThingStatus.INPROGRESS.key, ThingStatus.REOPENED.key].includes(thing.payload.status)
    }
}

function DismissAction(thing, currentUser, options={}) {
    return {
        component: <Action label="Dismiss" doFunc={ThingCommandActions.dismiss} preDoFunc={options.preDoFunc}
                           item={thing} disabled={options.disabled} key="action-Dismiss" />,
        show: currentUser && currentUser.id === thing.to.id &&
            [ThingStatus.NEW.key, ThingStatus.INPROGRESS.key, ThingStatus.REOPENED.key].includes(thing.payload.status) &&
            !thing.isSelf
    }
}

function CloseAction(thing, currentUser, options={}) {
    return {
        component: <Action label="Close" doFunc={ThingCommandActions.close} preDoFunc={options.preDoFunc}
                           item={thing} disabled={options.disabled} key="action-Close" />,
        show: currentUser && currentUser.id === thing.creator.id &&
            [ThingStatus.DONE.key, ThingStatus.DISMISS.key, ThingStatus.NEW.key, ThingStatus.REOPENED.key, ThingStatus.INPROGRESS.key].includes(thing.payload.status)
    }
}

function SendBackAction(thing, currentUser, options={}) {
    return {
        component: <Action label="SendBack" doFunc={ThingCommandActions.sendBack} preDoFunc={options.preDoFunc}
                           item={thing} disabled={options.disabled} key="action-SendBack" />,
        show: currentUser.id === thing.creator.id &&
            [ThingStatus.DONE.key, ThingStatus.DISMISS.key].includes(thing.payload.status)
    }
}

function PingAction(thing, currentUser, disabled) {
    return {
        component: <Action label="Ping" doFunc={ThingCommandActions.ping} item={thing} disabled={disabled} key="action-Ping" />,
        show: currentUser.id === thing.creator.id &&
            [ThingStatus.INPROGRESS.key].includes(thing.payload.status) &&
            !thing.isSelf
    }
}

function PongAction(thing, currentUser, options={}) {
    return {
        component: <Action label="Pong" doFunc={ThingCommandActions.pong} item={thing} preDoFunc={options.preDoFunc}
                           disabled={options.disabled} key="action-Pong" />,
        show: currentUser.id !== thing.creator.id &&
            [ThingStatus.INPROGRESS.key].includes(thing.payload.status) &&
            !thing.isSelf
    }
}

function DiscardCommentsAction(notification) {
    return {
        component: <Action label="Discard" doFunc={ThingCommandActions.discardComments} item={notification} key="action-Discard" />,
        show: notification.eventType.key === EventTypes.COMMENT.key
    }
}

function DiscardPingAction(notification) {
    return {
        component: <Action label="Discard" doFunc={ThingCommandActions.discardPing} item={notification} key="action-Discard" />,
        show: notification.eventType.key === EventTypes.PING.key
    }
}

function DiscardPongAction(notification) {
    return {
        component: <Action label="Discard" doFunc={ThingCommandActions.discardPong} item={notification} key="action-Discard" />,
        show: notification.eventType.key === EventTypes.PONG.key
    }
}

function CloseAckAction(notification) {
    return {
        component: <Action label="Stop doing" doFunc={ThingCommandActions.closeAck} item={notification.thing} key="action-StopDoing" />,
        show: notification.eventType.key === EventTypes.CLOSED.key
    }
}

function DiscardEmails(emailUids) {
    return {
        component: <Action label="Discard" doFunc={EmailCommandActions.markAsRead} item={emailUids} key="action-Discard" />,
        show: true
    }
}

function DoEmail(email, currentUser) {
    return {
        component: <Action label="Do" item={email.entityId} doFunc={EmailCommandActions.doEmail} key="action-do-email" />,
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
    CloseAckAction,
    DiscardEmails,
    DoEmail
}