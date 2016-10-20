import {remove, castArray, union, chain, omitBy, isNil, last, map, clone, uniq, reject} from 'lodash'
import AddressParser from 'email-addresses'

import {Event, Thing, User} from '../models'
import * as EventCreator from './event-creator'
import {eventToDto, thingToDto} from '../application/transformers'
import ThingStatus from '../../../common/enums/thing-status'
import EntityTypes from '../../../common/enums/entity-types'
import EventTypes from '../../../common/enums/event-types'
import UserTypes from '../../../common/enums/user-types'
import SharedConstants from '../../../common/shared-constants'
import {userToAddress, emailToAddress} from './address-creator'
import {sendMessage} from '../technical/email-send-service'
import logger from '../utils/logger'
import replyToAddress from '../config/reply-email'
import textToHtml from '../../../common/util/textToHtml'

export function getAllThings(user) {
    return Thing.getAllUserThings(user.id)
        .then(things => things.map(thing => thingToDto(thing, user)))
        .catch(error => {
            logger.error(`error while fetching all things of user ${user.email}`, error)
            throw error
        })
}

export function getWhatsNew(user) {
    return Event.getWhatsNew(user.id, true)
        .then(events => events.map(event => eventToDto(event, user, {includeFullThing: true})))
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
        const mentionedUserIds = await getMentionsFromText(body)

        const thing = await saveNewThing(body, subject, creator, toAddress, mentionedUserIds)
        await EventCreator.createCreated(creator, thing, getShowNewList, mentionedUserIds, body, thing.getEmailId())

        if (thing.isSelf()) {
            await EventCreator.createAccepted(creator, thing, getShowNewList, mentionedUserIds)
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

        const event = await EventCreator.createDismissed(creator, thing, getShowNewList, messageText)
        await sendEmailForEvent(user, thing, event)

    } catch(error) {
        logger.error(`error while dismissing thing ${thingId} by user ${user.email}`, error)
        throw error
    }
}

export async function close(user, thingId, messageText) {
    const creator = userToAddress(user)

    try {
        // TODO: only creator can close a thing

        const thing = await Thing.get(thingId).run()

        if (![EntityTypes.THING.key, EntityTypes.EMAIL_THING.key].includes(thing.type))
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

        // Discard all user events
        await Event.discardUserEvents(thingId, user.id)

        // Discard all existing user events from the Whatsnew page
        if ([ThingStatus.NEW.key, ThingStatus.INPROGRESS.key, ThingStatus.REOPENED.key].includes(previousStatus))
            await Event.discardThingEvents(thingId)

        // Creating the close event and saving to DB
        const event = await EventCreator.createClosed(creator, thing,
            (user, thing, eventType) => getShowNewList(user, thing, eventType, previousStatus),
            messageText)

        await sendEmailForEvent(user, thing, event)
    } catch(error) {
        logger.error(`error while closing thing ${thingId} by user ${user.email}:`, error)
        throw error
    }
}

export async function closeAck(user, thingId) {
    const creator = userToAddress(user)

    try {
        const thing = await Thing.get(thingId).run()

        remove(thing.doers, doerUserId => doerUserId === user.id)
        remove(thing.followUpers, followUpperUserId => followUpperUserId === user.id)
        thing.subscribers.push(user.id)
        await thing.save()

        await Event.discardUserEventsByType(thingId, EventTypes.CLOSED.key, user.id)
        await EventCreator.createCloseAck(creator, thing, getShowNewList)
    }
    catch(error) {
        logger.error(`error while accepting close of thing ${thingId} by user ${user.email}:`, error)
        throw error
    }
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
        await sendEmailForEvent(user, thing, event)

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

        const event = await EventCreator.createSentBack(creator, thing, getShowNewList, messageText)

        await sendEmailForEvent(user, thing, event)
        return event

    } catch (error) {
        logger.error(`Error while sending thing ${thingId} back by user ${user.email}:`, error)
        throw error
    }
}

export async function ping(user, thingId) {
    const creator = userToAddress(user)

    try {
        const thing = await Thing.get(thingId).run()

        validateStatus(thing, ThingStatus.INPROGRESS.key)

        const event = await EventCreator.createPing(creator, thing, getShowNewList)
        await sendEmailForEvent(user, thing, event)

        const fullEvent = await Event.getFullEvent(event.id)
        return eventToDto(fullEvent, user, {includeThing: true})
    } catch (error) {
        logger.error(`Error while pinging thing ${thingId} by user ${user.email}`, error)
        throw error
    }
}

export async function pong(user, thingId, messageText) {
    const creator = userToAddress(user)

    try {
        const thing = await Thing.get(thingId).run()
        
        validateStatus(thing, ThingStatus.INPROGRESS.key)

        const event = await EventCreator.createPong(creator, thing, getShowNewList, messageText)
        await sendEmailForEvent(user, thing, event)

        await Event.discardUserEventsByType(thing.id, EventTypes.PING.key, user.id)

        const fullEvent = await Event.getFullEvent(event.id)
        return eventToDto(fullEvent, user, {includeThing: false})

    } catch(error) {
        logger.error(`Error while ponging thing ${thingId} by user ${user.email}`, error)
        throw error
    }
}

export async function comment(user, thingId, commentText) {
    try {
        const creator = userToAddress(user)

        const thing = await Thing.get(thingId).run()

        const mentionedUserIds = await getMentionsFromText(commentText)
        const comment = await EventCreator.createComment(creator, new Date(), thing,
            (creator, thing, eventType) => getShowNewList(creator, thing, eventType, null, mentionedUserIds),
            mentionedUserIds, commentText)

        await updateThingMentions(thing, mentionedUserIds)

        await sendEmailForEvent(user, thing, comment)

        const fullEvent = await Event.getFullEvent(comment.id)
        return eventToDto(fullEvent, user, {includeThing: false})
    } catch (error) {
        logger.error(`Could not comment on thing ${thingId} for user ${user.email}`, error)
        throw error
    }
}

export async function followUp(user, thingId) {
    try {
        const creator = userToAddress(user)

        const thing = await Thing.get(thingId).run()

        if (!isCreatorOrMentioned(thing, user)) {
            throw 'UserNotMentioned'
        }

        if (![ThingStatus.NEW.key, ThingStatus.INPROGRESS.key, ThingStatus.REOPENED.key].includes(thing.payload.status)) {
            throw 'ThingIsClosed'
        }

        if (!thing.followUpers.includes(user.id)) {
            thing.followUpers.push(user.id)
            remove(thing.subscribers, userId => userId === user.id)
            await thing.save()

            await EventCreator.createFollowedUp(creator, thing, getShowNewList)

            await Event.discardUserEventsByType(thingId, EventTypes.CREATED.key, user.id)
            await Event.discardUserEventsByType(thingId, EventTypes.COMMENT.key, user.id)
            await Event.discardUserEventsByType(thingId, EventTypes.SENT_BACK.key, user.id)
        }

        return thingToDto(thing, user)
    } catch (error) {
        logger.error(`Could not folloup on thing ${thingId} for user ${user.email}`, error)
        throw error
    }
}

export async function unfollow(user, thingId) {
    const creator = userToAddress(user)

    const thing = await Thing.get(thingId).run()

    if (thing.followUpers.includes(user.id)) {
        remove(thing.followUpers, userId => userId === user.id)
        thing.subscribers.push(user.id)
        await thing.save()

        await EventCreator.createUnfollowedUp(creator, thing, getShowNewList)

        await Event.discardUserEventsByType(thingId, EventTypes.CLOSED.key, user.id)
        await Event.discardUserEventsByType(thingId, EventTypes.DONE.key, user.id)
        await Event.discardUserEventsByType(thingId, EventTypes.DISMISSED.key, user.id)
    }

    return thingToDto(thing, user)
}

export async function unmute(user, thingId) {
    const thing = await Thing.get(thingId).run()

    if (!isCreatorOrMentioned(thing, user)) {
        throw 'UserNotMentioned'
    }

    if (thing.followUpers.includes(user.id)) {
        throw 'UserAlreadyFollowUper'
    }

    if (!thing.subscribers.includes(user.id)) {
        thing.subscribers.push(user.id)
        await thing.save()

        const creator = userToAddress(user)
        await EventCreator.createUnmute(creator, thing, getShowNewList)
    }

    return thingToDto(thing, user)
}

export async function mute(user, thingId) {
    const thing = await Thing.get(thingId).run()

    if (thing.creator.id === user.id) {
        throw 'CreatorCannotMute'
    }

    if (thing.to.id === user.id) {
        throw 'ToCannotMute'
    }

    if (thing.subscribers.includes(user.id)) {
        remove(thing.subscribers, userId => userId === user.id)
        await thing.save()

        const creator = userToAddress(user)
        await EventCreator.createMute(creator, thing, getShowNewList)
    }

    return thingToDto(thing, user)
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
                return EventCreator.createComment(message.creator, message.createdAt, thing, getShowNewList, [], message.payload.text,
                    message.payload.html, message.id)
            }
        })
        .catch(error => {
            // If thing doesn't exist we just ignore the thing
            if (error.name !== 'DocumentNotFoundError')
                throw error
        })
}

export function addCommentFromEmail(thingId, messageId, from, date, text, html) {
    const creator = emailToAddress(from)

    return Thing.getFullThing(thingId)
        .then(thing => {
            const emailIds =
                thing.events.filter(event => event.payload && event.payload.emailId)
                    .map(comment => comment.payload.emailId)

            if (!emailIds.includes(messageId)) {
                return EventCreator.createComment(creator, date, thing, getShowNewList, [], text, html, messageId)
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

function getReplyAddress(thingId) {
    const parts = replyToAddress.split('@')

    return `${parts[0]}+${thingId}@${parts[1]}`
}

function sendEmailForThing(thing, user, toAddress, subject, body) {
    if (toAddress.type === UserTypes.EMAIL.key) {
        const messageId = thing.getEmailId()

        const htmlBody =
            `<div>
                <div>${textToHtml(body)}</div><br>
                <span>
                    ${user.firstName} ${user.lastName} is using Freection.
                    If you want to let ${user.firstName} know that's going on with this thing, try Freection 
                    <a href="https://freection.com" target="_blank">here!</a>
                </span>
            </div>`

        // we don't wait for the send email to complete, we want it to be async so creating a thing won't be delayed
        sendMessage(user, {
            to: toAddress.payload.email,
            subject,
            html: htmlBody,
            messageId,
            replyTo: getReplyAddress(thing.id)
        })
            .then(() => logger.info(`Email send successfully from ${user.email} to ${toAddress.payload.email}`))
            .catch(error => logger.error(`Error while sending email from ${user.email} to ${toAddress.payload.email}`, error))
    }

    return Promise.resolve(null)
}

async function sendEmailForEvent(user, thing, event) {
    // Event without any message
    if (!event.payload.text && !event.payload.html)
        return

    const emailRecipients = chain([thing.creator, thing.to])
        .filter({type: UserTypes.EMAIL.key})
        .map('payload.email')
        .value()

    if (!emailRecipients.length)
        return

    const email = user.email
    const domain = email.substr(email.indexOf('@'))

    const messageId = `comment/${event.id}${domain}`
    const emailIds = await Event.getThingEmailIds(thing.id)
    const subject = `Re: ${thing.subject}`

    // Create the message object, remove text or html if undefined and merge with rest or object
    const message = {
        to: emailRecipients,
        subject,
        messageId,
        replyTo: getReplyAddress(thing.id),
        references: emailIds,
        inReplyTo: last(emailIds)}

    if (event.payload.text)
        message.text = event.payload.text

    if (event.payload.html)
        message.html = event.payload.html

    sendMessage(user, message)
        .then(() => logger.info(`Email send successfully from ${user.email} to ${emailRecipients}`))
        .catch(error => logger.error(`Error while sending email from ${user.email} to ${emailRecipients}`, error))
}

function saveNewThing(body, subject, creator, to, mentionedUserIds) {
    // check if thing is self thing (assigned to creator)
    const isSelfThing = creator.id === to.id
    const status = isSelfThing ? ThingStatus.INPROGRESS.key : ThingStatus.NEW.key
    const followUpers = isSelfThing ? [] : [creator.id]
    const doers = isSelfThing ? [creator.id] : []
    const mentioned = mentionedUserIds
    const subscribers = mentionedUserIds

    return Thing.save({
        createdAt: new Date(),
        creator,
        to,
        body,
        subject,
        followUpers,
        doers,
        mentioned,
        subscribers,
        all: uniq([creator.id, to.id, ...mentioned]),
        type: EntityTypes.THING.key,
        payload: omitBy({
            status
        }, isNil)
    })
}

function isCreatorOrMentioned(thing, user) {
    return thing.mentioned.includes(user.id) || thing.creator.id === user.id
}

async function updateThingMentions(thing, mentionedUserIds) {
    if (!mentionedUserIds || !mentionedUserIds.length)
        return

    thing.mentioned = uniq([...thing.mentioned, ...mentionedUserIds])
    thing.subscribers = uniq([...thing.subscribers, ...mentionedUserIds])
    thing.all = uniq([...thing.all, ...mentionedUserIds])
    await thing.save()
}

function getShowNewList(user, thing, eventType, previousStatus, mentionedUserIdsInEvent) {
    let showNewList

    switch (eventType) {
        case EventTypes.CREATED.key:
            showNewList = [...getToList(thing), ...thing.mentioned]
            break
        case EventTypes.DISMISSED.key:
        case EventTypes.DONE.key:
            showNewList = union(thing.followUpers, thing.subscribers)
            break
        case EventTypes.CLOSED.key:
            if ([ThingStatus.NEW.key, ThingStatus.INPROGRESS.key, ThingStatus.REOPENED.key].includes(previousStatus))
                showNewList = union(thing.doers, thing.followUpers, thing.subscribers, getToList(thing))
            else
                showNewList = []
            break
        case EventTypes.SENT_BACK.key:
            showNewList = union(thing.doers, thing.followUpers, thing.subscribers, getToList(thing))
            break
        case EventTypes.COMMENT.key:
            showNewList = union(thing.followUpers, thing.doers, thing.subscribers, mentionedUserIdsInEvent, [thing.creator.id])
            break
        case EventTypes.PING.key:
            showNewList = [...thing.doers]
            break
        case EventTypes.PONG.key:
            showNewList = [...thing.followUpers, ...thing.subscribers]
            break
        case EventTypes.ACCEPTED.key:
        case EventTypes.CLOSE_ACKED.key:
        case EventTypes.UNMUTED.key:
        case EventTypes.MUTED.key:
        case EventTypes.FOLLOWED_UP.key:
        case EventTypes.UNFOLLOWED.key:
            showNewList = []
            break
        default:
            throw 'UnknownEventType'
    }

    // Removing the creator of the event from the list
    return reject(showNewList, id => id === user.id)
}

function getToList(thing) {
    return thing.to.type === UserTypes.FREECTION.key ? [thing.to.id] : []
}

function performDoThing(thing, user) {
    thing.doers.push(user.id)
    thing.payload.status = ThingStatus.INPROGRESS.key
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

async function getMentionsFromText(text) {
    if (!text)
        return []

    const matches = text.match(SharedConstants.MENTION_REGEX)

    if (!matches || !matches.length)
        return []

    const mentionedUsers = await Promise.all(chain(matches)
        .map(match => match.replace(/^\s*@/, ''))
        .uniq()
        .map(username => {
            return User.getUserByUsername(username).catch(error => {
                if (error === 'NotFound')
                    return null
                throw error
            })
        })
        .value()
    )

    return mentionedUsers.map(user => user.id)
}
