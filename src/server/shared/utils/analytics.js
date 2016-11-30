import {Client} from 'intercom-client'
import {now, toInteger} from 'lodash'
import customerio from 'node-customerio'

import {isAnalyticsEnabled, intercomToken, customerioApiKey, customerioSiteId} from '../config/analytics.js'
import userTypes from '../../../common/enums/user-types.js'
import ThingSource from '../../../common/enums/thing-source'
import DeviceType from '../../../common/enums/device-types'
import * as ThingHelper from '../../../common/helpers/thing-helper'
import logger from './logger'

const client = isAnalyticsEnabled && intercomToken ? new Client({token: intercomToken}) : null

if (isAnalyticsEnabled && customerioApiKey) {
    customerio.init(customerioSiteId, customerioApiKey)
}

function trackCustomer(name, userId, payload = {}) {
    if (isAnalyticsEnabled && customerioApiKey) {
        customerio.track(userId, name, payload)
    }
}

function trackIntercomEvent(name, userId, metadata = {}) {
    if (client) {
        const createdAt = toInteger(now() / 1000)

        client.events.create({
            event_name: name,
            user_id: userId,
            created_at: createdAt,
            metadata
        }).catch(error => logger.error('error while posting event to intercom', error))
    }
}

export function thingCreated(thing, showNewList) {
    if (thing.creator.type === userTypes.FREECTION.key) {
        const to = thing.to.payload && thing.to.payload.email ? thing.to.payload.email : thing.to.displayName

        const sourceDevice = thing.payload.sourceDevice ? thing.payload.sourceDevice.key : DeviceType.UNKNOWN.key
        const source = thing.payload.source || ThingSource.WEB.key

        trackIntercomEvent('created_thing', thing.creator.id, {
            type: thing.type,
            is_self: ThingHelper.isSelf(thing),
            to_type: thing.to.type,
            to,
            source: `${sourceDevice} (${source})`
        })
    }

    if (thing.to.type === userTypes.FREECTION.key && !ThingHelper.isSelf(thing)) {
        const creator = thing.creator.payload && thing.creator.payload.email ? thing.creator.payload.email : thing.creator.displayName

        trackIntercomEvent('received_thing', thing.to.id, {
            type: thing.type,
            creator_type: thing.creator.type,
            creator
        })

        trackCustomer('received_thing', thing.to.id, {
            type: thing.type,
            creator_type: thing.creator.type,
            creator: thing.creator.displayName,
            subject: thing.subject,
        })
    }

    notification_received(showNewList, 'thing_created')
}

export function commentCreated(user, thing, showNewList) {
    if (user.type === userTypes.FREECTION.key) {
        trackIntercomEvent('comment_created', user.id, {
            type: thing.type,
        })
    }

    const creator = user.payload && user.payload.email ? user.payload.email : user.displayName

    showNewList.forEach(userId => {
        trackIntercomEvent('comment_received', userId, {
            type: thing.type,
            creator
        })

        trackCustomer('comment_received', userId, {
            type: thing.type,
            creator_type: user.type,
            creator: user.displayName,
            subject: thing.subject
        })
    })

    notification_received(showNewList, 'comment_created')
}

export function mentioned(user, thing, mentioned) {

    if (!mentioned)
        return

    mentioned.forEach(mentionedUserId => {
        if (user.type === userTypes.FREECTION.key) {
            trackIntercomEvent('mentioned', user.id, {
                type: thing.type,
                mentioned_user_id: mentionedUserId
            })
        }

        const creator = user.payload && user.payload.email ? user.payload.email : user.displayName

        trackIntercomEvent('been_mentioned', mentionedUserId, {
            type: thing.type,
            mentioned_by: creator
        })
    })
}


export function thingDismissed(user, thing, showNewList) {
    if (user.type === userTypes.FREECTION.key) {
        trackIntercomEvent('dismissed', user.id, {
            type: thing.type,
        })
    }

    showNewList.forEach(userId => {
        trackCustomer('dismissed_received', userId, {
            type: thing.type,
            creator_type: user.type,
            creator: user.displayName,
            subject: thing.subject
        })
    })

    notification_received(showNewList, 'dismissed')
}

export function thingMarkedAsDone(user, thing, showNewList) {
    if (user.type === userTypes.FREECTION.key) {
        trackIntercomEvent('marked_as_done', user.id, {
            type: thing.type,
        })
    }

    showNewList.forEach(userId => {
        trackCustomer('marked_as_done_received', userId, {
            type: thing.type,
            creator_type: user.type,
            creator: user.displayName,
            subject: thing.subject
        })
    })

    notification_received(showNewList, 'marked_as_done')
}

export function closed(user, thing, showNewList) {
    if (user.type === userTypes.FREECTION.key) {
        trackIntercomEvent('closed', user.id, {
            type: thing.type,
        })
    }

    showNewList.forEach(userId => {
        trackCustomer('closed_received', userId, {
            type: thing.type,
            creator_type: user.type,
            creator: user.displayName,
            subject: thing.subject
        })
    })

    notification_received(showNewList, 'closed')
}

export function pingCreated(user, thing, showNewList) {
    if (user.type === userTypes.FREECTION.key) {
        trackIntercomEvent('created_ping', user.id, {
            type: thing.type,
        })
    }

    showNewList.forEach(userId => {
        trackCustomer('ping_received', userId, {
            type: thing.type,
            creator_type: user.type,
            creator: user.displayName,
            subject: thing.subject
        })
    })

    notification_received(showNewList, 'pinged')
}

export function pongCreated(user, thing, showNewList) {
    if (user.type === userTypes.FREECTION.key) {
        trackIntercomEvent('created_pong', user.id, {
            type: thing.type,
        })
    }

    showNewList.forEach(userId => {
        trackCustomer('pong_received', userId, {
            type: thing.type,
            creator_type: user.type,
            creator: user.displayName,
            subject: thing.subject
        })
    })

    notification_received(showNewList, 'ponged')
}

export function sentBack(user, thing, showNewList) {
    if (user.type === userTypes.FREECTION.key) {
        trackIntercomEvent('sent_back', user.id, {
            type: thing.type,
        })
    }

    showNewList.forEach(userId => {
        trackCustomer('sent_back_received', userId, {
            type: thing.type,
            creator_type: user.type,
            creator: user.displayName,
            subject: thing.subject
        })
    })

    notification_received(showNewList, 'sent_back')
}

export function unmuted(user, thing) {
    if (user.type === userTypes.FREECTION.key) {
        trackIntercomEvent('unmuted', user.id, {
            type: thing.type
        })
    }
}

export function muted(user, thing) {
    if (user.type === userTypes.FREECTION.key) {
        trackIntercomEvent('muted', user.id, {
            type: thing.type
        })
    }
}

export function followedUp(user, thing) {
    if (user.type === userTypes.FREECTION.key) {
        trackIntercomEvent('followed_up', user.id, {
            type: thing.type
        })
    }
}

export function unfollowed(user, thing) {
    if (user.type === userTypes.FREECTION.key) {
        trackIntercomEvent('unfollowed', user.id, {
            type: thing.type
        })
    }
}

function notification_received(users, type) {
    users.forEach(userId => {
        trackIntercomEvent('notification_received', userId, { type })
        trackCustomer('notification_received', userId, { type })
    })
}