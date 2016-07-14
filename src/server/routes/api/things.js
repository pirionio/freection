const router = require('express').Router()
const {remove, pick} = require('lodash')

const {Event, Thing, User} = require('../../models')
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

function doThing(thing, user) {
    thing.doers.push(user.id)
    remove(thing.followers, followingUserId => followingUserId === user.id)
    return thing.save()
}

function acceptThing(thing) {
    return Event.save({
        thingId: thing.id,
        type: Event.events.ACCEPTED,
        createdAt: new Date(),
        payload: {},
        readList: []
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
        subject: thing.subject
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
                    body: event.thing.body
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
        then(acceptThing).
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