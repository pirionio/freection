import {remove, castArray, union, chain, omitBy, isNil, last} from 'lodash'
import AddressParser from 'email-addresses'

import {Event, Thing, User} from '../models'
import * as EventCreator from './event-creator'
import {eventToDto, thingToDto} from '../application/transformers'
import ThingStatus from '../../../common/enums/thing-status'
import EntityTypes from '../../../common/enums/entity-types'
import EventTypes from '../../../common/enums/event-types'
import UserTypes from '../../../common/enums/user-types'
import {userToAddress, emailToAddress} from './address-creator'
import * as EmailService from './email-service'
import logger from '../utils/logger'

export function getWhatsNew(user) {
    return Event.getWhatsNew(user.id)
        .then(events => events.map(event => eventToDto(event, user)))
        .catch(error => {
            logger.error(`error while fetching whats new for user ${user.email}`, error)
            throw error
        })
}

export function getToDo(user) {
    return Thing.getUserToDos(user.id)
        .then(things => things.map(thing => thingToDto(thing, user)))
        .catch(error => {
            logger.error(`error while fetching to do list for user ${user.email}`, error)
            throw error
        })
}

export function getFollowUps(user) {
    return Thing.getUserFollowUps(user.id)
        .then(followUps => followUps.map(thing => thingToDto(thing, user)))
        .catch(error => {
            logger.error(`error while fetching follow ups for user ${user.email}`, error)
            throw error
        })
}

export function getEmailThings(user) {
    return Thing.getUserToDos(user.id)
        .then(emailThings => emailThings
            .filter(thing => thing.type === EntityTypes.EMAIL_THING.key)
            .map(thing => thingToDto(thing, user)))
        .catch(error => {
            logger.error(`error while fetching email things for user ${user.email}`, error)
            throw error
        })
}

export function getThing(user, thingId) {
    return Thing.getFullThing(thingId)
        .then(thing => thingToDto(thing, user))
        .catch(error => {
            logger.error(`error while fetching thing ${thingId} for user ${user.email}`, error)
            throw error
        })
}

export async function newThing(user, to, subject, body) {
    const creator = userToAddress(user)

    try {
        const toAddress = await getToAddress(to)
        const thing = await saveNewThing(body, subject, creator, toAddress)
        await EventCreator.createCreated(creator, thing, getShowNewList, body, thing.getEmailId())

        if (thing.isSelf()) {
            await EventCreator.createAccepted(creator, thing, getShowNewList)
        }

        await sendEmailForThing(thing, user, toAddress, subject, body)

        return thing.id
    } catch(error) {
        logger.error(`error while creating new thing for user ${user.email}`, error)
        throw error
    }
}

export function doThing(user, thingId) {
    const creator = userToAddress(user)

    return Thing.get(thingId).run()
        .then(validateType)
        .then(thing => validateStatus(thing, [ThingStatus.NEW.key, ThingStatus.REOPENED.key]))
        .then(thing => performDoThing(thing, user))
        .then(thing => EventCreator.createAccepted(creator, thing, getShowNewList))
        .then(() => Event.discardUserEvents(thingId, user.id))
        .catch(error => {
            logger.error(`error while setting user ${user.email} as doer of thing ${thingId}:`, error)
            throw error
        }
    )
}

export async function dismiss(user, thingId, messageText) {
    const creator = userToAddress(user)

    try {
        const thing = await Thing.get(thingId).run()

        if (![EntityTypes.THING.key, EntityTypes.EMAIL_THING.key].includes(thing.type))
            throw 'InvalidEntityType'

        // Validate that the status of the thing matched the action
        validateStatus(thing, [ThingStatus.NEW.key, ThingStatus.REOPENED.key, ThingStatus.INPROGRESS.key])

        remove(thing.doers, doerId => doerId === user.id)
        thing.payload.status = ThingStatus.DISMISS.key
        await thing.save()

        await Event.discardUserEvents(thingId, user.id)

        await EventCreator.createDismissed(creator, thing, getShowNewList, messageText)

    } catch(error) {
        logger.error(`error while dismissing thing ${thingId} by user ${user.email}`, error)
        throw error
    }
}

export async function close(user, thingId, messageText) {
    const creator = userToAddress(user)

    try {
        const thing = await Thing.get(thingId).run()

        if (thing.type !== EntityTypes.THING.key)
            throw 'InvalidEntityType'

        // Validate that the status of the thing matched the action
        validateStatus(thing, [ThingStatus.NEW.key, ThingStatus.REOPENED.key,
            ThingStatus.INPROGRESS.key, ThingStatus.DONE.key, ThingStatus.DISMISS.key])

        // Removing the user from the doers and follow upers
        remove(thing.followUpers, followUperId => followUperId === user.id)
        remove(thing.doers, doerUserId => doerUserId === user.id)

        // Update the status
        const previousStatus = thing.payload.status
        thing.payload.status = ThingStatus.CLOSE.key

        // saving the thing
        await thing.save()

        // Discard all existing user evens from the Whatsnew page
        await Event.discardThingEvents(thingId, user.id)

        // Creating the close event and saving to DB
        await EventCreator.createClosed(creator, thing,
            (user, thing, eventType) => getShowNewList(user, thing, eventType, previousStatus),
            messageText)
    } catch(error) {
        logger.error(`error while closing thing ${thingId} by user ${user.email}:`, error)
        throw error
    }
}

export function closeAck(user, thingId) {
    const creator = userToAddress(user)

    return Thing.get(thingId).run()
        .then(thing => {
            return performCloseAck(thing, user)
                .then(() => Event.discardUserEventsByType(thingId, EventTypes.CLOSED.key, user.id))
                .then(() => EventCreator.createCloseAck(creator, thing, getShowNewList))
        })
        .catch(error => {
            logger.error(`error while accepting close of thing ${thingId} by user ${user.email}:`, error)
            throw error
        })
}

export async function markAsDone(user, thingId, messageText) {
    const creator = userToAddress(user)

    try {
        const thing = await Thing.get(thingId).run()

        // Validate that the status of the thing matched the action
        validateStatus(thing, [ThingStatus.NEW.key, ThingStatus.REOPENED.key, ThingStatus.INPROGRESS.key])

        remove(thing.doers, doerId => doerId === user.id)
        thing.payload.status = thing.isSelf() ? ThingStatus.CLOSE.key : ThingStatus.DONE.key
        await thing.save()
        
        await Event.discardUserEvents(thingId, user.id)
        
        let event = await EventCreator.createDone(creator, thing, getShowNewList, messageText)

        if (thing.isSelf()) {
            event = await EventCreator.createClosed(creator, thing, getShowNewList)
        }
        
        return event

    } catch (error) {
        logger.error(`Error while marking thing ${thingId} as done by user ${user.email}:`, error)
        throw error
    }
}

export async function sendBack(user, thingId, messageText) {
    const creator = userToAddress(user)

    try {
        const thing = await Thing.get(thingId).run()

        validateStatus(thing, [ThingStatus.DONE.key, ThingStatus.DISMISS.key])

        thing.payload.status = ThingStatus.REOPENED.key
        await thing.save()

        await Event.discardUserEvents(thingId, user.id)

        return await EventCreator.createSentBack(creator, thing, getShowNewList, messageText)

    } catch (error) {
        logger.error(`Error while sending thing ${thingId} back by user ${user.email}:`, error)
        throw error
    }
}

export function ping(user, thingId) {
    const creator = userToAddress(user)

    return Thing.get(thingId).run()
        .then(thing => validateStatus(thing, ThingStatus.INPROGRESS.key))
        .then(thing => EventCreator.createPing(creator, thing, getShowNewList))
        .then(event => Event.getFullEvent(event.id))
        .then(event => eventToDto(event, user, {includeThing: false}))
        .catch(error => {
            logger.error(`Error while pinging thing ${thingId} by user ${user.email}`, error)
            throw error
        })
}

export async function pong(user, thingId, messageText) {
    const creator = userToAddress(user)

    try {
        const thing = await Thing.get(thingId).run()
        
        validateStatus(thing, ThingStatus.INPROGRESS.key)

        const event = await EventCreator.createPong(creator, thing, getShowNewList, messageText)

        await Event.discardUserEventsByType(thing.id, EventTypes.PING.key, user.id)

        const fullEvent = await Event.getFullEvent(event.id)
        return eventToDto(fullEvent, user, {includeThing: false})

    } catch(error) {
        logger.error(`Error while ponging thing ${thingId} by user ${user.email}`, error)
        throw error
    }
}

export function comment(user, thingId, commentText) {
    const creator = userToAddress(user)

    return Thing.get(thingId).run()
        .then(thing => {
            sendEmailForComment(user, thing, commentText)
                .then(email => EventCreator.createComment(creator, new Date(), thing, getShowNewList,
                    commentText, null, email && email.id))
                .then(event => Event.getFullEvent(event.id))
                .then(event => eventToDto(event, user, {includeThing: false}))
        })
        .catch(error => {
            logger.error(`Could not comment on thing ${thingId} for user ${user.email}`, error)
            throw error
        })
}

export function discardEventsByType(user, thingId, eventType) {
    return Event.discardUserEventsByType(thingId, eventType, user.id)
        .catch(error => {
            logger.error(`Could not discard events of type ${eventType} unread by user ${user.email} for thing ${thingId}`, error)
            throw error
        })
}

export function syncThingWithMessage(thingId, message) {
    return Thing.getFullThing(thingId)
        .then(thing => {
            const emailIds =
                thing.events.filter(event => event.payload && event.payload.emailId)
                    .map(comment => comment.payload.emailId)

            if (!emailIds.includes(message.id)) {
                return EventCreator.createComment(message.creator, message.createdAt, thing, getShowNewList, message.payload.text,
                    message.payload.html, message.id)
            }
        })
        .catch(error => {
            // If thing doesn't exist we just ignore the thing
            if (error.name !== 'DocumentNotFoundError')
                throw error
        })
}

function getToAddress(to) {
    const email = AddressParser.parseOneAddress(to).address

    return User.getUserByEmail(email)
        .then(toUser => userToAddress(toUser))
        .catch(error => {
            if (error !== 'NotFound')
                throw error
            else
                return emailToAddress(to)
        })
}

function sendEmailForThing(thing, user, toAddress, subject, body) {
    if (toAddress.type === UserTypes.EMAIL.key) {
        const messageId = thing.getEmailId()
        return EmailService.sendEmailForThing(user, toAddress.payload.email, subject, body, messageId)
    }

    return Promise.resolve(null)
}

function sendEmailForComment(user, thing, commentText) {
    const emailRecipients = chain([thing.creator, thing.to])
        .filter({type: UserTypes.EMAIL.key})
        .map('payload.email')
        .value()

    if (!emailRecipients.length)
        return Promise.resolve(null)

    return Event.getThingEmailIds(thing.id)
        .then(emailIds => {
            return EmailService.replyToAll(user, emailRecipients, last(emailIds), emailIds,  thing.subject, commentText)
        })
}

function saveNewThing(body, subject, creator, to, email) {
    // check if thing is self thing (assigned to creator)
    const isSelfThing = creator.id === to.id
    const status = isSelfThing ? ThingStatus.INPROGRESS.key : ThingStatus.NEW.key
    const followUpers = isSelfThing ? [] : [creator.id]
    const doers = isSelfThing ? [creator.id] : []

    return Thing.save({
        createdAt: new Date(),
        creator,
        to,
        body,
        subject,
        followUpers,
        doers,
        type: EntityTypes.THING.key,
        payload: omitBy({
            status,
            emailId: email ? email.id : null
        }, isNil)
    })
}

function getShowNewList(user, thing, eventType, previousStatus) {
    if (thing.isSelf())
        return []

    switch (eventType) {
        case EventTypes.CREATED.key:
            return getToList(thing)
        case EventTypes.DISMISSED.key:
        case EventTypes.DONE.key:
            return [thing.creator.id]
        case EventTypes.CLOSED.key:
            if ([ThingStatus.NEW.key, ThingStatus.INPROGRESS.key, ThingStatus.REOPENED.key].includes(previousStatus))
                return union(thing.doers, getToList(thing))

            return thing.doers
        case EventTypes.SENT_BACK.key:
            return union(thing.doers, getToList(thing))
        case EventTypes.COMMENT.key:
            return union(thing.followUpers, thing.doers, [thing.creator.id]).filter(userId => userId !== user.id)
        case EventTypes.PING.key:
            return  [...thing.doers]
        case EventTypes.PONG.key:
            return  [...thing.followUpers]
        case EventTypes.ACCEPTED.key:
        case EventTypes.CLOSE_ACKED.key:
            return []
        default:
            throw 'UnknownEventType'
    }
}

function getToList(thing) {
    return thing.to.type === UserTypes.FREECTION.key ? [thing.to.id] : []
}

function performDoThing(thing, user) {
    thing.doers.push(user.id)
    thing.payload.status = ThingStatus.INPROGRESS.key
    return thing.save()
}

function performCloseAck(thing, user) {
    remove(thing.doers, doerUserId => doerUserId === user.id)
    return thing.save()
}

function validateStatus(thing, allowedStatuses) {
    if (!castArray(allowedStatuses).includes(thing.payload.status))
        throw 'IllegalOperation'

    return thing
}

function validateType(thing) {
    if (thing.type !== EntityTypes.THING.key)
        throw 'InvalidEntityType'

    return thing
}