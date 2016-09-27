import React from 'react'

import * as ThingCommandActions from '../../actions/thing-command-actions'
import * as EmailCommandActions from '../../actions/email-command-actions'
import Action from './Action'
import ThingStatus from '../../../common/enums/thing-status'
import EventTypes from '../../../common/enums/event-types'

export function DoAction(thing, currentUser, disabled) {
    return {
        component: <Action label="Do" doFunc={ThingCommandActions.doThing} item={thing} disabled={disabled} key="action-Do" />,
        show: currentUser && currentUser.id === thing.to.id &&
            [ThingStatus.NEW.key, ThingStatus.REOPENED.key].includes(thing.payload.status)
    }
}

export function DoneAction(thing, currentUser, options={}) {
    return {
        component: <Action label="Done" doFunc={ThingCommandActions.markAsDone} preDoFunc={options.preDoFunc}
                           item={thing} disabled={options.disabled} key="action-Done" />,
        show: currentUser.id === thing.to.id &&
            [ThingStatus.NEW.key, ThingStatus.INPROGRESS.key, ThingStatus.REOPENED.key].includes(thing.payload.status)
    }
}

export function DismissAction(thing, currentUser, options={}) {
    return {
        component: <Action label="Dismiss" doFunc={ThingCommandActions.dismiss} preDoFunc={options.preDoFunc}
                           item={thing} disabled={options.disabled} key="action-Dismiss" />,
        show: currentUser && currentUser.id === thing.to.id &&
            [ThingStatus.NEW.key, ThingStatus.INPROGRESS.key, ThingStatus.REOPENED.key].includes(thing.payload.status) &&
            !thing.isSelf
    }
}

export function CloseAction(thing, currentUser, options={}) {
    return {
        component: <Action label="Close" doFunc={ThingCommandActions.close} preDoFunc={options.preDoFunc}
                           item={thing} disabled={options.disabled} key="action-Close" />,
        show: currentUser && currentUser.id === thing.creator.id &&
            [ThingStatus.DONE.key, ThingStatus.DISMISS.key, ThingStatus.NEW.key, ThingStatus.REOPENED.key, ThingStatus.INPROGRESS.key].includes(thing.payload.status)
    }
}

export function SendBackAction(thing, currentUser, options={}) {
    return {
        component: <Action label="SendBack" doFunc={ThingCommandActions.sendBack} preDoFunc={options.preDoFunc}
                           item={thing} disabled={options.disabled} key="action-SendBack" />,
        show: currentUser.id === thing.creator.id &&
            [ThingStatus.DONE.key, ThingStatus.DISMISS.key].includes(thing.payload.status)
    }
}

export function PingAction(thing, currentUser, disabled) {
    return {
        component: <Action label="Ping" doFunc={ThingCommandActions.ping} item={thing} disabled={disabled} key="action-Ping" />,
        show: currentUser.id === thing.creator.id &&
            [ThingStatus.INPROGRESS.key].includes(thing.payload.status) &&
            !thing.isSelf
    }
}

export function PongAction(thing, currentUser, options={}) {
    return {
        component: <Action label="Pong" doFunc={ThingCommandActions.pong} item={thing} preDoFunc={options.preDoFunc}
                           disabled={options.disabled} key="action-Pong" />,
        show: currentUser.id !== thing.creator.id &&
            [ThingStatus.INPROGRESS.key].includes(thing.payload.status) &&
            !thing.isSelf
    }
}

export function DiscardCommentsAction(notification) {
    return {
        component: <Action label="Discard" doFunc={ThingCommandActions.discardComments} item={notification} key="action-Discard" />,
        show: notification.eventType.key === EventTypes.COMMENT.key
    }
}

export function DiscardNotificationAction(notification, eventType) {
    return {
        component: <Action label="Discard" doFunc={ThingCommandActions.discardSingleNotification} item={notification} key="action-Discard" />,
        show: notification.eventType.key === eventType.key
    }
}

export function JoinMention(notification) {
    return {
        component: <Action label="Join" doFunc={ThingCommandActions.joinMention} item={notification} key="action-Join" />,
        show: notification.eventType.key === EventTypes.MENTIONED.key
    }
}

export function CloseAckAction(notification) {
    return {
        component: <Action label="Stop doing" doFunc={ThingCommandActions.closeAck} item={notification.thing} key="action-StopDoing" />,
        show: notification.eventType.key === EventTypes.CLOSED.key
    }
}

export function DiscardEmails(emailUids) {
    return {
        component: <Action label="Discard" doFunc={EmailCommandActions.markAsRead} item={emailUids} key="action-Discard" />,
        show: true
    }
}

export function DoEmail(email, currentUser) {
    return {
        component: <Action label="Do" item={email.payload.threadId} doFunc={EmailCommandActions.doEmail} key="action-do-email" />,
        show: email.creator.id !== currentUser.email
    }
}
