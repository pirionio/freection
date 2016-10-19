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
            [ThingStatus.DONE.key, ThingStatus.DISMISS.key, ThingStatus.NEW.key, ThingStatus.REOPENED.key, ThingStatus.INPROGRESS.key].includes(thing.payload.status) &&
            !thing.isSelf
    }
}

export function SendBackAction(thing, currentUser, options={}) {
    return {
        component: <Action label="Send Back" doFunc={ThingCommandActions.sendBack} preDoFunc={options.preDoFunc}
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
        show: notification.eventType.key === EventTypes.COMMENT.key && (!notification.payload || !notification.payload.isMentioned)
    }
}

export function DiscardNotificationAction(notification, eventType, label = 'Discard') {
    return {
        component: <Action label={label} doFunc={ThingCommandActions.discardSingleNotification} item={notification} key="action-Discard" />,
        show: notification.eventType.key === eventType.key
    }
}

export function Unmute(thing) {
    return {
        component: <Action label="Unmute" doFunc={ThingCommandActions.unmute} item={thing} key="action-unmute" />,
        show: !thing.isFollowUper && !thing.isSubscriber && (thing.isMentioned || thing.isCreator)
    }
}

export function Mute(thing) {
    return {
        component: <Action label="Mute" doFunc={ThingCommandActions.mute} item={thing} key="action-mute" />,
        show: thing.isSubscriber && !thing.isCreator && !thing.isTo
    }
}

export function CloseAckAction(notification) {
    return {
        component: <Action label="Close" doFunc={ThingCommandActions.closeAck} item={notification.thing} key="action-Close" />,
        show: notification.thing.isDoer && notification.eventType.key === EventTypes.CLOSED.key
    }
}

export function FollowUpAction(thing) {
    return {
        component: <Action label="Follow Up" doFunc={ThingCommandActions.followUp} item={thing} key="action-FollowUp" />,
        show: [ThingStatus.NEW.key, ThingStatus.INPROGRESS.key, ThingStatus.REOPENED.key].includes(thing.payload.status) &&
            !thing.isFollowUper && (thing.isCreator || thing.isMentioned)
    }
}

export function UnfollowAction(thing, label = 'Unfollow') {

    const canCreatorUnfollow  = (thing.isFollowUper && thing.isCreator &&
        [ThingStatus.NEW.key, ThingStatus.INPROGRESS.key, ThingStatus.REOPENED.key].includes(thing.payload.status))

    const canFollowUpperUnfollow = (thing.isFollowUper && !thing.isCreator)

    return {
        component: <Action label={label} doFunc={ThingCommandActions.unfollow} item={thing} key="action-Unfollow" />,
        show: canCreatorUnfollow || canFollowUpperUnfollow
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
