const React = require('react')

const ThingCommandActions = require('../../actions/thing-command-actions')
const EmailCommandActions = require('../../actions/email-command-actions')
const Action = require('./Action')
const ThingStatus = require('../../../common/enums/thing-status')
const EventTypes = require('../../../common/enums/event-types')

function DoAction(thing, currentUser) {
    return {
        component: <Action label="Do" doFunc={ThingCommandActions.doThing} item={thing} key="action-Do" />,
        show: currentUser.id === thing.to.id &&
            [ThingStatus.NEW.key, ThingStatus.REOPENED.key].includes(thing.payload.status)
    }
}

function DoneAction(thing, currentUser) {
    return {
        component: <Action label="Done" doFunc={ThingCommandActions.markAsDone} item={thing} key="action-Done" />,
        show: currentUser.id === thing.to.id &&
            [ThingStatus.NEW.key, ThingStatus.INPROGRESS.key, ThingStatus.REOPENED.key].includes(thing.payload.status)
    }
}

function DismissAction(thing, currentUser) {
    return {
        component: <Action label="Dismiss" doFunc={ThingCommandActions.dismiss} item={thing} key="action-Dismiss" />,
        show: currentUser.id === thing.to.id &&
            [ThingStatus.NEW.key, ThingStatus.INPROGRESS.key, ThingStatus.REOPENED.key].includes(thing.payload.status) &&
            !thing.isSelf
    }
}

function CloseAction(thing, currentUser) {
    return {
        component: <Action label="Close" doFunc={ThingCommandActions.close} item={thing} key="action-Close" />,
        show: currentUser.id === thing.creator.id &&
            [ThingStatus.DONE.key, ThingStatus.DISMISS.key].includes(thing.payload.status)
    }
}

function CancelAction(thing, currentUser) {
    return {
        component: <Action label="Cancel" doFunc={ThingCommandActions.cancel} item={thing} key="action-Cancel" />,
        show: currentUser.id === thing.creator.id &&
            [ThingStatus.NEW.key, ThingStatus.REOPENED.key, ThingStatus.INPROGRESS.key].includes(thing.payload.status)
    }
}

function SendBackAction(thing, currentUser) {
    return {
        component: <Action label="SendBack" doFunc={ThingCommandActions.sendBack} item={thing} key="action-SendBack" />,
        show: currentUser.id === thing.creator.id &&
            [ThingStatus.DONE.key, ThingStatus.DISMISS.key].includes(thing.payload.status)
    }
}

function PingAction(thing, currentUser) {
    return {
        component: <Action label="Ping" doFunc={ThingCommandActions.ping} item={thing} key="action-Ping" />,
        show: currentUser.id === thing.creator.id &&
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

function CancelAckAction(notification) {
    return {
        component: <Action label="Stop doing" doFunc={ThingCommandActions.cancelAck} item={notification.thing} key="action-StopDoing" />,
        show: notification.eventType.key === EventTypes.CANCELED.key
    }
}

function DiscardEmails(emailIds) {
    return {
        component: <Action label="Discard" doFunc={EmailCommandActions.markAsRead} item={emailIds} key="action-Discard" />,
        show: true
    }
}

module.exports = {
    DoAction,
    DoneAction,
    DismissAction,
    CloseAction,
    CancelAction,
    PingAction,
    SendBackAction,
    DiscardCommentsAction,
    DiscardPingAction,
    CancelAckAction,
    DiscardEmails
}