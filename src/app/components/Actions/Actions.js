const React = require('react')
const includes = require('lodash/includes')

const ThingCommandActions = require('../../actions/thing-command-actions')
const Action = require('./Action')
const ThingStatus = require('../../../common/enums/thing-status')
const EventTypes = require('../../../common/enums/event-types')

const DoAction = {
    getComponent: (thing) => <Action label="Do" doFunc={ThingCommandActions.doThing} item={thing} key="action-Do" />,
    shouldShow: (thing, currentUser) => {
        return currentUser.id === thing.to.id &&
            includes([ThingStatus.NEW.key, ThingStatus.REOPENED.key], thing.payload.status)
    }
}

const DoneAction = {
    getComponent: (thing) => <Action label="Done" doFunc={ThingCommandActions.markAsDone} item={thing} key="action-Done" />,
    shouldShow: (thing, currentUser) => {
        return currentUser.id === thing.to.id &&
            includes([ThingStatus.NEW.key, ThingStatus.INPROGRESS.key, ThingStatus.REOPENED.key], thing.payload.status)
    }
}

const DismissAction = {
    getComponent: (thing) => <Action label="Dismiss" doFunc={ThingCommandActions.dismiss} item={thing} key="action-Dismiss" />,
    shouldShow: (thing, currentUser) => {
        return currentUser.id === thing.to.id &&
            includes([ThingStatus.NEW.key, ThingStatus.INPROGRESS.key, ThingStatus.REOPENED.key], thing.payload.status) &&
            !thing.isSelf
    }
}

const CloseAction = {
    getComponent: (thing) => <Action label="Close" doFunc={ThingCommandActions.close} item={thing} key="action-Close" />,
    shouldShow: (thing, currentUser) => {
        return currentUser.id === thing.creator.id &&
            includes([ThingStatus.DONE.key, ThingStatus.DISMISS.key], thing.payload.status)
    }
}

const CancelAction = {
    getComponent: (thing) => <Action label="Cancel" doFunc={ThingCommandActions.cancel} item={thing} key="action-Cancel" />,
    shouldShow: (thing, currentUser) => {
        return currentUser.id === thing.creator.id &&
            includes([ThingStatus.NEW.key, ThingStatus.REOPENED.key, ThingStatus.INPROGRESS.key], thing.payload.status)
    }
}

const PingAction = {
    getComponent: (thing) => <Action label="Ping" doFunc={ThingCommandActions.ping} item={thing} key="action-Ping" />,
    shouldShow: (thing, currentUser) => {
        return currentUser.id === thing.creator.id &&
            includes([ThingStatus.INPROGRESS.key], thing.payload.status) &&
            !thing.isSelf
    }
}

const SendBacAction = {
    getComponent: (thing) => <Action label="Send Back" doFunc={ThingCommandActions.sendBack} item={thing} key="action-SendBack" />,
    shouldShow: (thing, currentUser) => {
        return currentUser.id === thing.creator.id &&
            includes([ThingStatus.DONE.key, ThingStatus.DISMISS.key], thing.payload.status)
    }
}

const DiscardCommentsAction = {
    getComponent: (notification) => <Action label="Discard" doFunc={ThingCommandActions.discardComments} item={notification} key="action-Discard" />,
    shouldShow: (notification) => {
        return notification.eventType.key === EventTypes.COMMENT.key
    }
}

const DiscardPingAction = {
    getComponent: (notification) => <Action label="Discard" doFunc={ThingCommandActions.discardPing} item={notification} key="action-Discard" />,
    shouldShow: (notification) => {
        return notification.eventType.key === EventTypes.PING.key
    }
}

const CancelAckAction = {
    getComponent: (thing) => <Action label="Stop doing" doFunc={ThingCommandActions.cancelAck} item={thing} key="action-StopDoing" />,
    shouldShow: (notification) => {
        return notification.eventType.key === EventTypes.CANCELED.key
    }
}

module.exports = {
    DoAction,
    DoneAction,
    DismissAction,
    CloseAction,
    CancelAction,
    PingAction,
    SendBacAction,
    DiscardCommentsAction,
    DiscardPingAction,
    CancelAckAction
}