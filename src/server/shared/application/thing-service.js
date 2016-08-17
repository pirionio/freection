const {remove, castArray, union, chain, omitBy, isNil, last} = require('lodash')

const {Event, Thing, User} = require('../models')
const EventCreator = require('./event-creator')
const {eventToDto, thingToDto} = require('../application/transformers')
const ThingStatus = require('../../../common/enums/thing-status')
const EntityTypes = require('../../../common/enums/entity-types')
const EventTypes = require('../../../common/enums/event-types')
const UserTypes = require('../../../common/enums/user-types')
const {userToAddress, emailToAddress} = require('./address-creator')
const EmailService = require('./email-service')
const logger = require('../utils/logger')

function getWhatsNew(user) {
    return Event.getWhatsNew(user.id)
        .then(events => events.map(event => eventToDto(event, user)))
        .catch(error => {
            logger.error(`error while fetching whats new for user ${user.email}`, error)
            throw error
        })
}

function getToDo(user) {
    return Thing.getUserToDos(user.id)
        .then(things => things.map(thing => thingToDto(thing, user)))
        .catch(error => {
            logger.error(`error while fetching to do list for user ${user.email}`, error)
            throw error
        })
}

function getFollowUps(user) {
    return Thing.getUserFollowUps(user.id)
        .then(followUps => followUps.map(thing => thingToDto(thing, user)))
        .catch(error => {
            logger.error(`error while fetching follow ups for user ${user.email}`, error)
            throw error
        })
}

function getThing(user, thingId) {
    return Thing.getFullThing(thingId)
        .then(thing => thingToDto(thing, user))
        .catch(error => {
            logger.error(`error while fetching thing ${thingId} for user ${user.email}`, error)
            throw error
        })
}

async function newThing(user, to, subject, body) {
    const creator = userToAddress(user)

    try {
        const toAddress = await getToAddress(to)
        const thing = await saveNewThing(body, subject, creator, toAddress)
        await EventCreator.createCreated(creator, thing, getShowNewList, body, thing.getEmailId())

        if (thing.isSelf()) {
            await EventCreator.createAccepted(creator, thing, getShowNewList)
        }

        await sendEmailForThing(thing, user, toAddress, subject, body)
    } catch(error) {
        logger.error(`error while creating new thing for user ${user.email}`, error)
        throw error
    }
}

function doThing(user, thingId) {
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

async function dismiss(user, thingId, messageText) {
    const creator = userToAddress(user)

    try {
        const thing = await Thing.get(thingId).run()

        if (thing.type !== EntityTypes.THING.key)
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

async function close(user, thingId) {
    const creator = userToAddress(user)

    try {
        const thing = await Thing.get(thingId).run()

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
            (user, thing, eventType) => getShowNewList(user, thing, eventType, previousStatus))
    } catch(error) {
        logger.error(`error while closing thing ${thingId} by user ${user.email}:`, error)
        throw error
    }
}

function cancelAck(user, thingId) {
    const creator = userToAddress(user)

    return Thing.get(thingId).run()
        .then(thing => {
            return performCancelAck(thing, user)
                .then(() => Event.discardUserEventsByType(thingId, EventTypes.CLOSED.key, user.id))
                .then(() => EventCreator.createCancelAck(creator, thing, getShowNewList))
        })
        .catch(error => {
            logger.error(`error while accepting cancellation of thing ${thingId} by user ${user.email}:`, error)
            throw error
        })
}

function markAsDone(user, thingId) {
    const creator = userToAddress(user)

    return Thing.get(thingId).run()
        .then(thing => validateStatus(thing, [ThingStatus.NEW.key, ThingStatus.REOPENED.key, ThingStatus.INPROGRESS.key]))
        .then(thing => {
            return performMarkAsDone(thing, user)
                .then(() => Event.discardUserEvents(thingId, user.id))
                .then(() => EventCreator.createDone(creator, thing, getShowNewList))
                .then(() => {
                    if (thing.isSelf()) {
                        return EventCreator.createClosed(creator, thing, getShowNewList)
                    }
                })
        })
        .catch(error => {
            logger.error(`Error while marking thing ${thingId} as done by user ${user.email}:`, error)
            throw error
        })
}

function sendBack(user, thingId) {
    const creator = userToAddress(user)

    return Thing.get(thingId).run()
        .then(thing => validateStatus(thing, [ThingStatus.DONE.key, ThingStatus.DISMISS.key]))
        .then(thing => {
            return performSendBack(thing)
                .then(() => Event.discardUserEvents(thingId, user.id))
                .then(() => EventCreator.createSentBack(creator, thing, getShowNewList))
        })
        .catch(error => {
            logger.error(`Error while sending thing ${thingId} back by user ${user.email}:`, error)
            throw error
        })
}

function ping(user, thingId) {
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

async function pong(user, thingId, messageText) {
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

function comment(user, thingId, commentText) {
    const creator = userToAddress(user)

    return Thing.get(thingId).run()
        .then(thing => {
            sendEmailForComment(user, thing, commentText)
                .then(email => EventCreator.createComment(creator, thing, getShowNewList,
                    commentText, null, email && email.id))
                .then(event => Event.getFullEvent(event.id))
                .then(event => eventToDto(event, user, {includeThing: false}))
        })
        .catch(error => {
            logger.error(`Could not comment on thing ${thingId} for user ${user.email}`, error)
            throw error
        })
}

function discardEventsByType(user, thingId, eventType) {
    return Event.discardUserEventsByType(thingId, eventType, user.id)
        .catch(error => {
            logger.error(`Could not discard events of type ${eventType} unread by user ${user.email} for thing ${thingId}`, error)
            throw error
        })
}

function syncThingWithMessage(thingId, message) {
    return Thing.getFullThing(thingId)
        .then(thing => {
            const emailIds =
                thing.events.filter(event => event.payload && event.payload.emailId)
                    .map(comment => comment.payload.emailId)

            if (!emailIds.includes(message.id)) {
                return EventCreator.createComment(message.creator, thing, getShowNewList, message.payload.text,
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
    return User.getUserByEmail(to)
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
    else
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
            else
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
        case EventTypes.CANCEL_ACKED.key:
            return []
        default:
            throw "UnknownEventType"
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

function performMarkAsDone(thing, user) {
    remove(thing.doers, doerId => doerId === user.id)
    thing.payload.status = thing.isSelf() ? ThingStatus.CLOSE.key : ThingStatus.DONE.key
    return thing.save()
}

function performSendBack(thing) {
    thing.payload.status = ThingStatus.REOPENED.key
    return thing.save()
}

function performCancelAck(thing, user) {
    remove(thing.doers, doerUserId => doerUserId === user.id)
    return thing.save()
}

function validateStatus(thing, allowedStatuses) {
    if (!castArray(allowedStatuses).includes(thing.payload.status))
        throw "IllegalOperation"

    return thing
}

function validateType(thing) {
    if (thing.type !== EntityTypes.THING.key)
        throw 'InvalidEntityType'

    return thing
}

module.exports = {
    getWhatsNew,
    getToDo,
    getFollowUps,
    getThing,
    newThing,
    doThing,
    dismiss,
    markAsDone,
    sendBack,
    comment,
    close,
    cancelAck,
    ping,
    pong,
    discardEventsByType,
    syncThingWithMessage
}