import remove from 'lodash/remove'

import EventTypes from '../../common/enums/event-types'
import Logo from '../static/logo-black.png'
import EntityTypes from '../../common/enums/entity-types.js'
import DeviceType from '../../common/enums/device-types'

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
        }
    } else {
        if (event.eventType.key === EventTypes.CREATED.key && event.thing.type.key === EntityTypes.EMAIL_THING.key) {
            emailThingCreateNotification(event)
        }

        if (event.eventType.key === EventTypes.CREATED.key && event.thing.payload.fromSlack) {
            fromSlackCreateNotification(event)
        }

        if (event.eventType.key === EventTypes.CREATED.key && event.thing.payload.sourceDevice.key !== DeviceType.DESKTOP.key) {
            fromMobileCreateNotification(event)
        }
    }
}

function showNotification(id, title, body) {
    if (notificationStore.includes(id))
        return

    const notification = new Notification(title, {
        body: body,
        icon: Logo
    })

    notificationStore.push = id

    setTimeout(() => {
        remove(notificationStore, id)
        notification.close()
    }, 5000)
}

function fromSlackCreateNotification(event) {
    if (event.thing.isFollowUper)
        showNotification(event.id, 'Thing from slack added to your Follow Up list', event.thing.subject)
    else if (event.thing.isDoer)
        showNotification(event.id, 'Thing from slack added to your To Do list list', event.thing.subject)
}

function emailThingCreateNotification(event) {
    const recipientNames = event.thing.payload.recipients
        .filter(recipient => recipient.emailAddress !== event.creator.payload.email)
        .map(recipient => recipient.name)
        .join(', ')

    showNotification(event.id, `Email from ${recipientNames} added to your To Do list`, event.thing.subject)
}

function fromMobileCreateNotification(event) {
    if (event.thing.isFollowUper)
        showNotification(event.id, 'Thing from your mobile added to your Follow Up list', event.thing.subject)
    else if (event.thing.isDoer)
        showNotification(event.id, 'Thing from your mobile added to your To Do list', event.thing.subject)
}

function createNotification(event) {
    showNotification(event.id, `${event.creator.displayName} sent you a thing`, event.thing.subject)
}

function doneNotification(event) {
    showNotification(event.id, `${event.creator.displayName} completed a thing`, event.thing.subject)
}

function dismissNotification(event) {
    showNotification(event.id, `${event.creator.displayName} dismissed a thing`, event.thing.subject)
}

function closedNotification(event) {
    showNotification(event.id, `${event.creator.displayName} closed a thing`, event.thing.subject)
}

function pingNotification(event) {
    showNotification(event.id, `${event.creator.displayName} pinged you`, event.thing.subject)
}

function pongNotification(event) {
    showNotification(event.id, `${event.creator.displayName} ponged ${event.thing.isFollowUper ? 'you' : ''}`, event.thing.subject)
}

function sendBackNotification(event) {
    showNotification(event.id, `${event.creator.displayName} sent a thing back`, event.thing.subject)
}

function mentionedNotification(event) {
    showNotification(event.id, `${event.creator.displayName} mentioned you`, event.thing.subject)
}