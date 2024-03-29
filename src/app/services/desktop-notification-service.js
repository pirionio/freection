import remove from 'lodash/remove'

import EventTypes from '../../common/enums/event-types'
import LogoNew from '../static/desktop-notification-new.png'
import LogoInProgress from '../static/desktop-notification-inprogress.png'
import LogoDone from '../static/desktop-notification-done.png'
import LogoDismissed from '../static/desktop-notification-dismissed.png'
import LogoClosed from '../static/desktop-notification-closed.png'
import EntityTypes from '../../common/enums/entity-types.js'
import DeviceType from '../../common/enums/device-types'
import EventType from '../../common/enums/event-types'
import ThingSource from '../../common/enums/thing-source'

const isNotificationEnabled = 'Notification' in window

const Notification = isNotificationEnabled ? window.Notification : null

const notificationStore = []

export function initialize() {
    if (isNotificationEnabled && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
        Notification.requestPermission()
    }
}

export function handleEvent(event) {

    if (event.showNew) {
        switch (event.eventType.key) {
            case EventTypes.CREATED.key:
                createNotification(event)
                break
            case EventTypes.DONE.key:
                doneNotification(event)
                break
            case EventTypes.DISMISSED.key:
                dismissNotification(event)
                break
            case EventTypes.CLOSED.key:
                closedNotification(event)
                break
            case EventTypes.PING.key:
                pingNotification(event)
                break
            case EventTypes.PONG.key:
                pongNotification(event)
                break
            case EventTypes.SENT_BACK.key:
                sendBackNotification(event)
                break
            case EventTypes.COMMENT.key:
                if (event.payload.isMentioned)
                    mentionedNotification(event)
                break
            case EventTypes.UNASSIGNED.key:
                unassignedNotification(event)
                break
            case EventTypes.TRELLO_LIST_CHANGED.key:
                trelloListChangedNotification(event)
                break
        }
    } else {
        if (event.eventType.key === EventTypes.CREATED.key && event.thing.type.key === EntityTypes.EMAIL_THING.key) {
            emailThingCreateNotification(event)
        } else if (event.eventType.key === EventTypes.CREATED.key && event.thing.payload.source === ThingSource.SLACK.key) {
            fromSlackCreateNotification(event)
        } else if (event.eventType.key === EventTypes.CREATED.key && event.thing.payload.sourceDevice &&
            event.thing.payload.sourceDevice.key === DeviceType.PHONE.key) {

            fromMobileCreateNotification(event)
        }
    }
}

function getLogoByEventType(type) {
    switch (type.key) {
        case EventType.CREATED.key:
        case EventType.SENT_BACK.key:
            return LogoNew
        case EventType.COMMENT.key:
        case EventType.PING.key:
        case EventType.PONG.key:
        case EventType.TRELLO_LIST_CHANGED.key:
            return LogoInProgress
        case EventType.DONE.key:
            return LogoDone
        case EventType.DISMISSED.key:
        case EventType.UNASSIGNED.key:
            return LogoDismissed
        case EventType.CLOSED.key:
            return LogoClosed
        default:
            return LogoInProgress
    }
}

function showNotification(id, title, body, type) {
    if (notificationStore.includes(id))
        return

    const notification = new Notification(title, {
        body: body,
        icon: getLogoByEventType(type)
    })

    notificationStore.push = id

    const timeoutId = setTimeout(() => {
        remove(notificationStore, id)
        notification.close()
    }, 5000)

    notification.onclick = () => {
        clearTimeout(timeoutId)
        notification.close()
        window.focus()
    }
}

function fromSlackCreateNotification(event) {
    if (event.thing.isFollowUper)
        showNotification(event.id, 'Task from slack added to your Follow Up list', event.thing.subject, event.eventType)
    else if (event.thing.isDoer)
        showNotification(event.id, 'Task from slack added to your To Do list', event.thing.subject, event.eventType)
}

function emailThingCreateNotification(event) {
    const recipientNames = event.thing.payload.recipients
        .filter(recipient => recipient.emailAddress !== event.creator.payload.email)
        .map(recipient => recipient.name)
        .join(', ')

    showNotification(event.id, `Email from ${recipientNames} added to your To Do list`, event.thing.subject, event.eventType)
}

function fromMobileCreateNotification(event) {
    if (event.thing.isFollowUper)
        showNotification(event.id, 'Task from your mobile added to your Follow Up list', event.thing.subject, event.eventType)
    else if (event.thing.isDoer)
        showNotification(event.id, 'Task from your mobile added to your To Do list', event.thing.subject, event.eventType)
}

function createNotification(event) {
    showNotification(event.id, `${event.creator.displayName} sent you a task`, event.thing.subject, event.eventType)
}

function doneNotification(event) {
    showNotification(event.id, `${event.creator.displayName} completed a task`, event.thing.subject, event.eventType)
}

function dismissNotification(event) {
    showNotification(event.id, `${event.creator.displayName} dismissed a task`, event.thing.subject, event.eventType)
}

function closedNotification(event) {
    showNotification(event.id, `${event.creator.displayName} closed a task`, event.thing.subject, event.eventType)
}

function pingNotification(event) {
    showNotification(event.id, `${event.creator.displayName} pinged you`, event.thing.subject, event.eventType)
}

function pongNotification(event) {
    showNotification(event.id, `${event.creator.displayName} ponged ${event.thing.isFollowUper ? 'you' : ''}`, event.thing.subject, event.eventType)
}

function sendBackNotification(event) {
    showNotification(event.id, `${event.creator.displayName} sent a task back`, event.thing.subject, event.eventType)
}

function mentionedNotification(event) {
    showNotification(event.id, `${event.creator.displayName} mentioned you`, event.thing.subject, event.eventType)
}

function unassignedNotification(event) {
    showNotification(event.id, `${event.creator.displayName} unassigned you`, event.thing.subject, event.eventType)
}

function trelloListChangedNotification(event) {
    showNotification(event.id, `card moved to list ${event.payload.toList.name}`, event.thing.subject, event.eventType)
}