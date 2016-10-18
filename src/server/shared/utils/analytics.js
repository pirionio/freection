import {Client} from 'intercom-client'
import {now, toInteger} from 'lodash'

import {isAnalyticsEnabled, intercomToken} from '../config/analytics.js'
import userTypes from '../../../common/enums/user-types.js'
import logger from './logger'

const client = isAnalyticsEnabled ? new Client({token: intercomToken}) : null

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

export function thingCreated(thing) {
    if (thing.creator.type === userTypes.FREECTION.key) {
        const to = thing.to.payload && thing.to.payload.email ? thing.to.payload.email : thing.to.displayName

        trackIntercomEvent('created_thing', thing.creator.id, {
            type: thing.type,
            is_self: thing.isSelf(),
            to_type: thing.to.type,
            to
        })
    }

    if (thing.to.type === userTypes.FREECTION.key && !thing.isSelf()) {
        const creator = thing.creator.payload && thing.creator.payload.email ? thing.creator.payload.email : thing.creator.displayName

        trackIntercomEvent('received_thing', thing.to.id, {
            type: thing.type,
            creator_type: thing.creator.type,
            creator
        })
    }
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
    })
}

export function thingDismissed(user, thing) {
    if (user.type === userTypes.FREECTION.key) {
        trackIntercomEvent('dismissed', user.id, {
            type: thing.type,
        })
    }
}

export function thingMarkedAsDone(user, thing) {
    if (user.type === userTypes.FREECTION.key) {
        trackIntercomEvent('marked_as_done', user.id, {
            type: thing.type,
        })
    }
}

export function closed(user, thing) {
    if (user.type === userTypes.FREECTION.key) {
        trackIntercomEvent('closed', user.id, {
            type: thing.type,
        })
    }
}

export function pingCreated(user, thing) {
    if (user.type === userTypes.FREECTION.key) {
        trackIntercomEvent('created_ping', user.id, {
            type: thing.type,
        })
    }
}

export function pongCreated(user, thing) {
    if (user.type === userTypes.FREECTION.key) {
        trackIntercomEvent('created_pong', user.id, {
            type: thing.type,
        })
    }
}

export function sentBack(user, thing) {
    if (user.type === userTypes.FREECTION.key) {
        trackIntercomEvent('sent_back', user.id, {
            type: thing.type,
        })
    }
}

export function mentioned(user, thing, mentionedUserId) {
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
}

export function joined(user, thing) {
    if (user.type === userTypes.FREECTION.key) {
        trackIntercomEvent('joined_mention', user.id, {
            type: thing.type
        })
    }
}

export function left(user, thing) {
    if (user.type === userTypes.FREECTION.key) {
        trackIntercomEvent('left_mention', user.id, {
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