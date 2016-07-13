const router = require('express').Router()
const {remove} = require('lodash')

const {Event, Thing} = require('../../models')
const logger = require('../../utils/logger')

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
    remove(event.readList, item => item.userId === user.id)
    return event.save()
}

function getEvent(eventId) {
    return Event.get(eventId).run()
}

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


module.exports = router