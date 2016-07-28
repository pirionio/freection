const {pick} = require('lodash/core')

const ThingTypes = require('../../../common/enums/thing-types')
const EventTypes = require('../../../common/enums/event-types')

function thingToDto(thing, user, {includeEvents = true} = {}) {
    return {
        id: thing.id,
        createdAt: thing.createdAt,
        creator: thing.creator && userToDto(thing.creator),
        to: thing.to && userToDto(thing.to),
        body: thing.body,
        subject: thing.subject,
        payload: thing.payload,
        type: ThingTypes[thing.type],
        events: includeEvents && thing.events ? thing.events.map(event => eventToDto(event, user, {includeThing: false})) : [],
        isFollowUper: thing.followUpers.includes(user.id),
        isDoer: thing.doers.includes(user.id),
        isSelf: thing.isSelf()
    }
}

function eventToDto(event, user, {includeThing = true} = {}) {
    return {
        id: event.id,
        thing: includeThing && event.thing && thingToDto(event.thing, user, {includeEvents: false}),
        createdAt: event.createdAt,
        payload: event.eventType === EventTypes.COMMENT.key || event.eventType === EventTypes.PING.key ?
            commentPayloadToDto(event.payload, user) : event.payload,
        eventType: EventTypes[event.eventType],
        creator: event.creator && userToDto(event.creator),
        showNew: event.showNewList.includes(user.id)
    }
}

function userToDto(user) {
    return pick(user, ['id', 'firstName', 'lastName', 'email'])
}

function commentPayloadToDto(payload, user) {
    return Object.assign({}, payload, {
        isRead: payload.readByList.includes(user.id),
        readByList: undefined
    })
}

module.exports = {thingToDto, eventToDto, userToDto}