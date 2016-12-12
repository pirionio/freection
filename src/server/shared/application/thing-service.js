import {remove, castArray, union, chain, isNil, last, map, uniq, reject, template, isEmpty, forOwn, find, isString, isObject} from 'lodash'
import AddressParser from 'email-addresses'
import requireText from 'require-text'
import juice from 'juice'
import htmlToText from 'html-to-text'

import {Event, User} from '../models'
import * as EventCreator from './event-creator'
import {eventToDto, thingToDto} from '../application/transformers'
import * as ThingDomain from '../domain/thing-domain'
import ThingStatus from '../../../common/enums/thing-status'
import EntityTypes from '../../../common/enums/entity-types'
import EventTypes from '../../../common/enums/event-types'
import UserTypes from '../../../common/enums/user-types'
import TodoTimeCategory from '../../../common/enums/todo-time-category'
import SharedConstants from '../../../common/shared-constants'
import {BOT} from '../constants'
import {userToAddress, emailToAddress, botToAddress} from './address-creator'
import {sendMessage} from '../technical/email-send-service'
import logger from '../utils/logger'
import GeneralConfig from '../config/general'
import {replyToAddress} from '../config/email'
import {url as pixelUrl} from '../config/pixel'
import textToHtml from '../../../common/util/textToHtml'
import * as ThingHelper from '../../../common/helpers/thing-helper'
import * as EmailParsingUtility from '../utils/email-parsing-utility.js'

const organizationEmailTemplate = template(requireText('./templates/email-template-organization.html', require))
const externalEmailTemplate = template(requireText('./templates/email-template-external.html', require))
const emailCommentTemplate = template(requireText('./templates/email-comment-template.html', require))

export function getAllThings(user) {
    return ThingDomain.getAllUserThings(user.id)
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

export async function getToDo(user) {
    try {
        const things = await ThingDomain.getUserToDos(user.id)
        const fullUser = await User.get(user.id).run()

        const orderedThings = []

        forOwn(fullUser.todos, (categoryTodos, categoryKey) => {
            // It's important to iterate the todos as they are set for the user, in order to maintain their order.
            categoryTodos.forEach(thingId => {
                const thing = find(things, {id: thingId})

                if (thing) {
                    thing.todoTimeCategory = TodoTimeCategory[categoryKey]
                    orderedThings.push(thingToDto(thing, user))
                }
            })
        })

        // Set a category for the things that didn't appear in any category
        things.forEach(thing => {
            if (isNil(thing.todoTimeCategory)) {
                thing.todoTimeCategory = TodoTimeCategory.LATER
                orderedThings.push(thingToDto(thing, user))
            }
        })

        return orderedThings
    } catch (error) {
        logger.error(`error while fetching to do list for user ${user.email}`, error)
        throw error
    }
}

export function getFollowUps(user) {
    return ThingDomain.getUserFollowUps(user.id)
        .then(followUps => followUps.map(thing => thingToDto(thing, user)))
        .catch(error => {
            logger.error(`error while fetching follow ups for user ${user.email}`, error)
            throw error
        })
}

export function getEmailThings(user) {
    return ThingDomain.getUserToDos(user.id)
        .then(emailThings => emailThings
            .filter(thing => thing.type === EntityTypes.EMAIL_THING.key)
            .map(thing => thingToDto(thing, user)))
        .catch(error => {
            logger.error(`error while fetching email things for user ${user.email}`, error)
            throw error
        })
}

export function getThing(user, thingId) {
    return ThingDomain.getFullThing(thingId)
        .then(thing => thingToDto(thing, user))
        .catch(error => {
            logger.error(`error while fetching thing ${thingId} for user ${user.email}`, error)
            throw error
        })
}

export async function newThing(user, to, content, payload = {}) {
    const creator = getCreatorAddress(user)

    try {
        fillContent(content)

        const toAddress =
            to && isString(to) ? (await getToAddress(to)) :
            to ? to : creator
        const mentionedUserIds = await getMentionsFromText(content.text)

        if (isEmpty(content.subject))
            throw new Error('Subject must be given as the first line in the message')

        const thing = await saveNewThing(content.text, content.subject, creator, toAddress, mentionedUserIds, payload)

        const createdEvent = EventCreator.createCreated(creator, thing, getShowNewList(user, thing, EventTypes.CREATED.key),
            mentionedUserIds, content.text, content.html, ThingHelper.getEmailId(thing))

        thing.events.push(createdEvent)

        if (ThingHelper.isSelf(thing)) {
            thing.events.push(EventCreator.createAccepted(creator, thing, [], mentionedUserIds))
        }

        const persistedThing = await ThingDomain.updateThing(thing)

        await sendEmailForThing(thing, createdEvent, user, toAddress, content.subject, content.text)

        return persistedThing
    } catch(error) {
        logger.error(`error while creating new thing for user ${user.email}`, error)
        throw error
    }
}

export async function doThing(user, thingId) {
    const creator = getCreatorAddress(user)

    try {
        const thing = await ThingDomain.getFullThing(thingId)

        if (thing.type !== EntityTypes.THING.key)
            throw 'InvalidEntityType'

        validateStatus(thing, [ThingStatus.NEW.key, ThingStatus.REOPENED.key])

        thing.doers.push(user.id)
        thing.payload.status = ThingStatus.INPROGRESS.key
        thing.events.push(EventCreator.createAccepted(creator, thing, []))
        ThingHelper.discardUserEvents(user, thing)

        return await ThingDomain.updateThing(thing)
    } catch(error) {
        logger.error(`error while setting user ${user.email} as doer of thing ${thingId}:`, error)
        throw error
    }
}

export async function dismiss(user, thingId, messageText) {
    const creator = getCreatorAddress(user)

    try {
        const thing = await ThingDomain.getFullThing(thingId)

        if (![EntityTypes.THING.key, EntityTypes.EMAIL_THING.key].includes(thing.type))
            throw 'InvalidEntityType'

        // Validate that the status of the thing matched the action
        validateStatus(thing, [ThingStatus.NEW.key, ThingStatus.REOPENED.key, ThingStatus.INPROGRESS.key])

        remove(thing.doers, doerId => doerId === user.id)
        thing.payload.status = ThingStatus.DISMISS.key
        thing.events.push(EventCreator.createDismissed(creator, thing, union(thing.followUpers, thing.subscribers), messageText))
        ThingHelper.discardUserEvents(user, thing)

        const persistedThing = await ThingDomain.updateThing(thing)

        await sendEmailForEvent(user, thing, last(thing.events))
        
        return persistedThing
    } catch(error) {
        logger.error(`error while dismissing thing ${thingId} by user ${user.email}`, error)
        throw error
    }
}

export async function close(user, thingId, messageText) {
    const creator = getCreatorAddress(user)

    try {
        // TODO: only creator can close a thing

        const thing = await ThingDomain.getFullThing(thingId)

        if (![EntityTypes.THING.key, EntityTypes.EMAIL_THING.key].includes(thing.type))
            throw 'InvalidEntityType'

        // Validate that the status of the thing matched the action
        validateStatus(thing, [ThingStatus.NEW.key, ThingStatus.REOPENED.key,
            ThingStatus.INPROGRESS.key, ThingStatus.DONE.key, ThingStatus.DISMISS.key])

        // Removing the user from the doers and follow upers
        remove(thing.followUpers, followUperId => followUperId === user.id)
        remove(thing.doers, doerUserId => doerUserId === user.id)

        ThingHelper.discardUserEvents(user, thing)

        // Discard all existing user events from the What's New page
        if ([ThingStatus.NEW.key, ThingStatus.INPROGRESS.key, ThingStatus.REOPENED.key].includes(thing.payload.status))
            ThingHelper.discardAllThingEvents(thing)

        const closedEvent = EventCreator.createClosed(creator, thing, getShowNewList(creator, thing, EventTypes.CLOSED.key), messageText)
        thing.events.push(closedEvent)

        // Update the status
        thing.payload.status = ThingStatus.CLOSE.key

        // saving the thing
        const persistedThing = await ThingDomain.updateThing(thing)

        await sendEmailForEvent(user, thing, closedEvent)
        
        return persistedThing
    } catch(error) {
        logger.error(`error while closing thing ${thingId} by user ${user.email}:`, error)
        throw error
    }
}

export async function closeAck(user, thingId) {
    const creator = getCreatorAddress(user)

    try {
        const thing = await ThingDomain.getFullThing(thingId)

        remove(thing.doers, doerUserId => doerUserId === user.id)
        remove(thing.followUpers, followUpperUserId => followUpperUserId === user.id)

        if (!thing.subscribers)
            thing.subscribers = []
                
        if (!thing.subscribers.includes(user.id))
            thing.subscribers.push(user.id)

        thing.events.push(EventCreator.createCloseAck(creator, thing, []))
        ThingHelper.discardUserEventsByType(user, thing, EventTypes.CLOSED)

        return await ThingDomain.updateThing(thing)
    }
    catch(error) {
        logger.error(`error while accepting close of thing ${thingId} by user ${user.email}:`, error)
        throw error
    }
}

export async function markAsDone(user, thingId, content) {
    const creator = getCreatorAddress(user)

    try {
        fillContent(content, false)

        const thing = await ThingDomain.getFullThing(thingId)

        // Validate that the status of the thing matched the action
        validateStatus(thing, [ThingStatus.NEW.key, ThingStatus.REOPENED.key, ThingStatus.INPROGRESS.key])

        remove(thing.doers, doerId => doerId === user.id)
        thing.payload.status = ThingHelper.isSelf(thing) ? ThingStatus.CLOSE.key : ThingStatus.DONE.key

        const doneEvent = EventCreator.createDone(creator, thing, getShowNewList(user, thing, EventTypes.DONE.key), content.text, content.html)
        thing.events.push(doneEvent)

        ThingHelper.discardUserEvents(user, thing)
        if (ThingHelper.isSelf(thing)) {
            thing.events.push(EventCreator.createClosed(creator, thing, getShowNewList(user, thing, EventTypes.CLOSED.key)))
        }

        const persistedThing = await ThingDomain.updateThing(thing)

        await sendEmailForEvent(user, thing, doneEvent)

        return persistedThing

    } catch (error) {
        logger.error(`Error while marking thing ${thingId} as done by user ${user.email}:`, error)
        throw error
    }
}

export async function sendBack(user, thingId, messageText) {
    const creator = getCreatorAddress(user)

    try {
        const thing = await ThingDomain.getFullThing(thingId)

        validateStatus(thing, [ThingStatus.DONE.key, ThingStatus.DISMISS.key])

        thing.payload.status = ThingStatus.REOPENED.key

        ThingHelper.discardUserEvents(user, thing)
        
        const sentBackEvent = EventCreator.createSentBack(creator, thing, getShowNewList(creator, thing, EventTypes.SENT_BACK.key), messageText)
        thing.events.push(sentBackEvent)

        const persistedThing = await ThingDomain.updateThing(thing)
        
        await sendEmailForEvent(user, thing, sentBackEvent)
        
        return persistedThing

    } catch (error) {
        logger.error(`Error while sending thing ${thingId} back by user ${user.email}:`, error)
        throw error
    }
}

export async function ping(user, thingId) {
    const creator = getCreatorAddress(user)

    try {
        const thing = await ThingDomain.getFullThing(thingId)

        validateStatus(thing, ThingStatus.INPROGRESS.key)

        const pingEvent = EventCreator.createPing(creator, thing, getShowNewList(creator, thing, EventTypes.PING.key))
        thing.events.push(pingEvent)

        const persistedThing = await ThingDomain.updateThing(thing)

        await sendEmailForEvent(user, thing, pingEvent)

        return persistedThing
    } catch (error) {
        logger.error(`Error while pinging thing ${thingId} by user ${user.email}`, error)
        throw error
    }
}

export async function pong(user, thingId, messageText) {
    const creator = getCreatorAddress(user)

    try {
        const thing = await ThingDomain.getFullThing(thingId)
        
        validateStatus(thing, ThingStatus.INPROGRESS.key)

        ThingHelper.discardUserEventsByType(user, thing, EventTypes.PING)

        const pongEvent = EventCreator.createPong(creator, thing, getShowNewList(creator, thing, EventTypes.PONG.key), messageText)
        thing.events.push(pongEvent)

        const persistedThing = await ThingDomain.updateThing(thing)

        await sendEmailForEvent(user, thing, pongEvent)

        return persistedThing
    } catch(error) {
        logger.error(`Error while ponging thing ${thingId} by user ${user.email}`, error)
        throw error
    }
}
 
export async function comment(user, thingId, content) {
    try {
        fillContent(content, false)

        const creator = getCreatorAddress(user)

        const thing = await ThingDomain.getFullThing(thingId)

        const mentionedUserIds = await getMentionsFromText(content.text)

        const comment = EventCreator.createComment(creator, new Date(), thing,
            getShowNewList(creator, thing, EventTypes.COMMENT.key, mentionedUserIds),
            mentionedUserIds, content.text, content.html)
        thing.events.push(comment)

        updateThingMentions(thing, mentionedUserIds)

        const persistedThing = await ThingDomain.updateThing(thing)

        await sendEmailForEvent(user, thing, comment)

        await Event.discardUserEventsByType(thingId, EventTypes.COMMENT.key, user.id)

        return persistedThing
    } catch (error) {
        logger.error(`Could not comment on thing ${thingId} for user ${user.email}`, error)
        throw error
    }
}

export async function followUp(user, thingId) {
    try {
        const creator = getCreatorAddress(user)

        const thing = await ThingDomain.getThing(thingId)

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
    const creator = getCreatorAddress(user)

    const thing = await ThingDomain.getThing(thingId)

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
    const thing = await ThingDomain.getThing(thingId)

    if (!isCreatorOrMentioned(thing, user)) {
        throw 'UserNotMentioned'
    }

    if (thing.followUpers.includes(user.id)) {
        throw 'UserAlreadyFollowUper'
    }

    if (!thing.subscribers.includes(user.id)) {
        thing.subscribers.push(user.id)
        await thing.save()

        const creator = getCreatorAddress(user)
        await EventCreator.createUnmute(creator, thing, getShowNewList)
    }

    return thingToDto(thing, user)
}

export async function mute(user, thingId) {
    const thing = await ThingDomain.getThing(thingId)

    if (thing.creator.id === user.id) {
        throw 'CreatorCannotMute'
    }

    if (thing.to.id === user.id) {
        throw 'ToCannotMute'
    }

    if (thing.subscribers.includes(user.id)) {
        remove(thing.subscribers, userId => userId === user.id)
        await thing.save()

        const creator = getCreatorAddress(user)
        await EventCreator.createMute(creator, thing, getShowNewList)
    }

    return thingToDto(thing, user)
}

export function discardComments(user, thingId) {
    return Event.discardUserUnmentionedComments(thingId, user.id)
        .catch(error => {
            logger.error(`Could not discard comments unread by user ${user.email} for thing ${thingId}`, error)
            throw error
        })
}

export function syncThingWithMessage(thingId, message) {
    return ThingDomain.getFullThing(thingId)
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

export async function addCommentFromEmail(thingId, messageId, from, date, text, html) {
    const creator = emailToAddress(from)

    try {
        const thing = await ThingDomain.getFullThing(thingId)

        const emailIds = thing.events
            .filter(event => event.payload && event.payload.emailId)
            .map(comment => comment.payload.emailId)

        if (!emailIds.includes(messageId)) {
            thing.events.push(EventCreator.createComment(creator, date, thing,
                getShowNewList(creator, thing, EventTypes.COMMENT.key),
                [], text, html, messageId))
            await ThingDomain.updateThing(thing)
        }
    } catch(error) {
        // If thing doesn't exist we just ignore the thing
        if (error.name !== 'DocumentNotFoundError')
            throw error
    }
}

function getCreatorAddress(creator) {
    if ((isString(creator) && creator === BOT.EMAIL) || (isObject(creator) && creator.type === UserTypes.BOT.key))
        return botToAddress()

    return userToAddress(creator)
}

async function getToAddress(to) {
    const email = AddressParser.parseOneAddress(to).address

    if (email === BOT.EMAIL)
        return botToAddress()

    try {
        const toUser = await User.getUserByEmail(email)
        return userToAddress(toUser)
    } catch (error) {
        if (error !== 'NotFound')
            throw error
        else
            return emailToAddress(to)
    }
}

function getReplyAddress(thingId) {
    const parts = replyToAddress.split('@')

    return `${parts[0]}+${thingId}@${parts[1]}`
}

async function getThingEmailBody(event, body, user, toAddress) {
    const toOrganization = EmailParsingUtility.getOrganization(toAddress.id)

    const bodyTemplate = toOrganization === user.organization ? organizationEmailTemplate : externalEmailTemplate

    return juice(bodyTemplate({
        body: textToHtml(body),
        firstName: user.firstName,
        email: toAddress.payload.email,
        eventId: event.id,
        logoUrl: `${GeneralConfig.BASE_URL}/logo-black.png`,
        pixelUrl: pixelUrl
    }))
}

async function sendEmailForThing(thing, event, user, toAddress, subject, body) {
    if (toAddress.type !== UserTypes.EMAIL.key)
        return null

    try {
        const messageId = ThingHelper.getEmailId(thing)

        const htmlBody = await getThingEmailBody(event, body, user, toAddress)

        // we don't wait for the send email to complete, we want it to be async so creating a thing won't be delayed
        await sendMessage(user, {
            to: toAddress.payload.email,
            subject,
            html: htmlBody,
            messageId,
            replyTo: getReplyAddress(thing.id)
        })

        logger.info(`Email send successfully from ${user.email} to ${toAddress.payload.email}`)
    } catch(error) {
        logger.error(`Error while sending email from ${user.email} to ${toAddress.payload.email}`, error)
    }
}

async function sendEmailForEvent(user, thing, event) {
    if (thing.to.type === UserTypes.BOT.key)
        return

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

    message.html = emailCommentTemplate({
        body: event.payload.html ? event.payload.html : textToHtml(event.payload.text),
        email: emailRecipients[0],
        eventId: event.id,
        pixelUrl: pixelUrl
    })

    try {
        await sendMessage(user, message)
        logger.info(`Email send successfully from ${user.email} to ${emailRecipients}`)
    } catch (error) {
        logger.error(`Error while sending email from ${user.email} to ${emailRecipients}`, error)
    }
}

function fillContent(content, fixSubject=true) {
    if (!content.text && content.html)
        content.text = htmlToText.fromString(content.html)

    if (!content.subject && content.text && fixSubject) {
        content.subject = extractSubjectOnly(content.text)
        content.text = extractBodyOnly(content.text)
    }

    if (!content.html && content.text)
        content.html = textToHtml(content.text)
}

function extractSubjectOnly(body) {
    const bodyLines = body ? body.match(/^(.*)$/m) : []
    return bodyLines && bodyLines.length && bodyLines[0]
}

function extractBodyOnly(body) {
    const firstNewlineIndex = body.indexOf('\n')
    return firstNewlineIndex > -1 ?
        body.substring(firstNewlineIndex + 1) :
        body
}

function saveNewThing(body, subject, creator, to, mentionedUserIds, payload) {
    // check if thing is self thing (assigned to creator)
    const isSelfThing = creator.id === to.id
    const status = isSelfThing ? ThingStatus.INPROGRESS.key : ThingStatus.NEW.key
    const followUpers = isSelfThing ? [] : [creator.id]
    const doers = isSelfThing ? [creator.id] : []
    const mentioned = mentionedUserIds
    const subscribers = mentionedUserIds
    const all = uniq(to.type === UserTypes.FREECTION.key ?
        [creator.id, to.id, ...mentioned] :
        [creator.id, ...mentioned])

    const thing = ThingDomain.createThing({
        createdAt: new Date(),
        creator,
        to,
        body,
        subject,
        followUpers,
        doers,
        mentioned,
        subscribers,
        all,
        type: EntityTypes.THING.key,
        payload: Object.assign({}, payload, {
            status
        }),
        events: []
    })

    return thing.save()
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
}

function getShowNewList(user, thing, eventType, mentionedUserIdsInEvent) {
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
            if ([ThingStatus.NEW.key, ThingStatus.INPROGRESS.key, ThingStatus.REOPENED.key].includes(thing.payload.status))
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

    return mentionedUsers.filter(user => !!user).map(user => user.id)
}
