const router = require('express').Router()
const {remove} = require('lodash')

const {Event, Thing} = require('../../models')
const ThingTransformer = require('../../transformers/thing-transformer')
const EventTransformer = require('../../transformers/event-transformer')
const EventTypes = require('../../../common/enums/event-types')
const TaskStatus = require('../../../common/enums/task-status')
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
    thing.payload.status = TaskStatus.INPROGRESS.key
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

router.get('/whatsnew', function(request, response) {
    const user = request.user

    getUserWhatsNew(user).
        then(events => {
            response.json(events.map(EventTransformer.docToDto))
        }).
        catch(error => {
            logger.error(`error while fetching whats new for user ${user.email}`, error)
            response.sendStatus(500)
        })
})

router.get('/do', function(request, response) {
    const user = request.user

    getUserToDo(user).
        then(things => response.json(things.map(ThingTransformer.docToDto))).
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
        then(followUps => response.json(followUps.map(ThingTransformer.docToDto))).
        catch(error => {
            logger.error(`error while fetching follow ups for user ${user.email}`, error)
            response.sendStatus(500)
        })
})

module.exports = router