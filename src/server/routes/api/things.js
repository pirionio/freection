const router = require('express').Router()
const {remove, pick} = require('lodash')

const {Event, Thing} = require('../../models')
const EventTypes = require('../../enums/event-types')
const ThingTypes = require('../../enums/thing-types')
const TaskStatus = require('../../enums/task-status')
const logger = require('../../utils/logger')

function getUserWhatsNew(user) {
    return Event.getWhatsNew(user.id)
}

function getUserToDo(user) {
    return Thing.getUserToDos(user.id)
}

function getThing(thingId) {
    return Thing.get(thingId).run()
}

function getFullThing(thingId) {
    return Thing.getFullThing(thingId)
}

function doThing(thing, user) {
    thing.doers.push(user.id)
    return thing.save()
}

function completeThing(thing, user) {
    remove(thing.doers, doerId => doerId === user.id)
    thing.payload.status = TaskStatus.DONE.key
    return thing.save()
}

function notifyThingAccepted(thing) {
    return Event.save({
        thingId: thing.id,
        eventType: EventTypes.ACCEPTED.key,
        createdAt: new Date(),
        payload: {},
        readList: []
    })
}

function notifyThingDone(thing) {
    return Event.save({
        thingId: thing.id,
        eventType: EventTypes.DONE.key,
        createdAt: new Date(),
        payload: {},
        readList: [thing.creator.id]
    })
}

function userReadEvent(event, user) {
    remove(event.readList, readerUserId => readerUserId === user.id)
    return event.save()
}

function getEvent(eventId) {
    return Event.get(eventId).run()
}

function getUserFollowUps(user) {
    return Thing.getUserFollowUps(user.id)
}

function mapThingToDTO(thing) {
    return {
        id: thing.id,
        createdAt: thing.createdAt,
        creator: pick(thing.creator, ['id', 'firstName', 'lastName', 'email']),
        to: pick(thing.to, ['id', 'firstName', 'lastName', 'email']),
        body: thing.body,
        subject: thing.subject,
        payload: thing.payload,
        type: ThingTypes[thing.type]
    }
}

router.get('/whatsnew', function(request, response) {
    const user = request.user

    getUserWhatsNew(user).
        then(events => {
            response.json(events.map(event => {
                return {
                    eventId: event.id,
                    thingId: event.thing.id,
                    createdAt: event.createdAt,
                    creator: pick(event.thing.creator, ['id', 'firstName', 'lastName', 'email']),
                    to: pick(event.thing.to, ['id', 'firstName', 'lastName', 'email']),
                    subject: event.thing.subject,
                    body: event.thing.body,
                    eventType: EventTypes[event.eventType]
                }
            }))
        }).
        catch(error => {
            logger.error(`error while fetching whats new for user ${user.email}`, error)
            response.sendStatus(500)
        })
})

router.get('/do', function(request, response) {
    const user = request.user

    getUserToDo(user).
        then(things => response.json(things.map(mapThingToDTO))).
        catch(error => {
            logger.error(`error while fetching to do list for user ${user.email}`, error)
            response.sendStatus(500)
        })
})

router.post('/do', function(request, response) {
    const user = request.user
    const {thingId, eventId} = request.body

    getThing(thingId).
        then(thing => doThing(thing, user)).
        then(notifyThingAccepted).
        then(() => getEvent(eventId)).
        then(event => userReadEvent(event, user)).
        then(() => response.json({})).
        catch((error) => {
            logger.error(`error while setting user ${user.email} as doer of thing ${thingId}: ${error}`)
            if (error && error.name === 'DocumentNotFoundError') {
                response.status(404).send(`Could not find Thing with ID ${thingId}`)
            } else {
                response.status(500).send(`Could not save user ${user.email} as a doer of thing ${thingId}: ${error.message}`)
            }
        }
    )
})

router.post('/done', function(request, response) {
    const user = request.user
    const {thingId} = request.body

    getFullThing(thingId).
    then(thing => completeThing(thing, user)).
    then(notifyThingDone).
    then(() => response.json({})).
    catch((error) => {
            logger.error(`Error while completing thing ${thingId} by user ${user.email}:`, error)
            if (error && error.name === 'DocumentNotFoundError') {
                response.status(404).send(`Could not find Thing with ID ${thingId}`)
            } else {
                response.status(500).send(`Could not complete thing ${thingId} by user ${user.email}: ${error.message}`)
            }
        }
    )
})

router.get('/followups', function(request, response) {
    const user = request.user

    getUserFollowUps(user).
        then(followUps => response.json(followUps.map(mapThingToDTO))).
        catch(error => {
            logger.error(`error while fetching follow ups for user ${user.email}`, error)
            response.sendStatus(500)
        })
})

module.exports = router