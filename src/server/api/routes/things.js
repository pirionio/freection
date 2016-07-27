const router = require('express').Router()

const ThingService = require('../../shared/application/thing-service')
const EventService = require('../../shared/application/event-service')
const logger = require('../../shared/utils/logger')

router.get('/whatsnew', function(request, response) {
    const user = request.user

    ThingService.getWhatsNew(user)
        .then(events => response.json(events))
        .catch(error => response.status(500).send(`Could not fetch What's New for user ${user.email}: ${error.message}`))
})

router.get('/do', function(request, response) {
    const user = request.user

    ThingService.getToDo(user)
        .then(things => response.json(things))
        .catch(error => response.status(500).send(`Could not fetch To Do for user ${user.email}: ${error.message}`))
})

router.post('/:thingId/do', function(request, response) {
    const user = request.user
    const {thingId} = request.params

    ThingService.doThing(user, thingId)
        .then(() => response.json({}))
        .catch(error => {
            if (error && error.name === 'DocumentNotFoundError') {
                response.status(404).send(`Could not find Thing with ID ${thingId}`)
            } else {
                response.status(500).send(`Could not save user ${user.email} as a doer of thing ${thingId}: ${error.message}`)
            }
        })
})

router.post('/:thingId/dismiss', function(request, response) {
    const user = request.user
    const {thingId} = request.params

    ThingService.dismiss(user, thingId)
        .then(() => response.json({}))
        .catch(error => {
            if (error && error.name === 'DocumentNotFoundError') {
                response.status(404).send(`Could not find Thing with ID ${thingId}`)
            } else {
                response.status(500).send(`Could not dismiss thing ${thingId} by user ${user.email}: ${error.message}`)
            }
        })
})

router.post('/:thingId/done', function(request, response) {
    const user = request.user
    const {thingId} = request.params

    ThingService.markAsDone(user, thingId)
        .then(() => response.json({}))
        .catch(error => {
            if (error && error.name === 'DocumentNotFoundError') {
                response.status(404).send(`Could not find Thing with ID ${thingId}`)
            } else {
                response.status(500).send(`Could not mark thing ${thingId} as done by user ${user.email}: ${error.message}`)
            }
        }
    )
})

router.post('/:thingId/close', function(request, response) {
    const {user} = request
    const {thingId} = request.params

    ThingService.close(user, thingId)
        .then(() => response.json({}))
        .catch(error => {
            if (error && error.name === 'DocumentNotFoundError') {
                response.status(404).send(`Could not find thing with ID ${thingId}`)
            } else {
                response.status(500).send(`Could not close thing ${thingId} by user ${user.email} : ${error.message}`)
            }
        })
})

router.post('/:thingId/abort', function(request, response) {
    const {user} = request
    const {thingId} = request.params

    ThingService.abort(user, thingId)
        .then(() => response.json({}))
        .catch(error => {
            if (error && error.name === 'DocumentNotFoundError') {
                response.status(404).send(`Could not find thing with ID ${thingId}`)
            } else {
                response.status(500).send(`Could not abort thing ${thingId} by user ${user.email} : ${error.message}`)
            }
        })
})

router.post('/:thingId/ping', function(request, response) {
    const {user} = request
    const {thingId} = request.params

    ThingService.ping(user, thingId)
        .then(pingEvent => response.json(pingEvent))
        .catch(error => {
            if (error && error.name === 'DocumentNotFoundError') {
                response.status(404).send(`Could not find thing with ID ${thingId}`)
            } else {
                response.status(500).send(`Could not ping thing ${thingId} by user ${user.email} : ${error.message}`)
            }
        })
})

router.get('/followups', function(request, response) {
    const user = request.user

    ThingService.getFollowUps(user)
        .then(things => response.json(things))
        .catch(error => response.status(500).send(`Could not fetch Follow Ups for user ${user.email}: ${error.message}`))
})

router.post('/:thingId/comment', function(request, response) {
    const user = request.user
    const {thingId} = request.params
    const {commentText} = request.body

    ThingService.comment(user, thingId, commentText)
        .then(comment => response.json(comment))
        .catch(error => response.status(500).send(`Could not comment on thing ${thingId}: ${error.message}`))
})

router.post('/:thingId/discard/:eventType', function(request, response) {
    const user = request.user
    const {thingId, eventType} = request.params

    EventService.discardByType(user, thingId, eventType)
        .then(() => response.json({}))
        .catch(error => {
            if (error && error.name === 'DocumentNotFoundError') {
                response.status(404).send(`Could not find Thing with ID ${thingId}`)
            } else {
                response.status(500).send(`Could not discard events of type ${eventType} unread by user ${user.email} for thing ${thingId}: ${error.message}`)
            }
        })
})

router.post('/:commentId/markcommentasread', function(request, response) {
    const {user} = request
    const {commentId} = request.params

    EventService.markAsRead(user, commentId)
        .then(() => response.json({}))
        .catch(error => {
            if (error && error.name === 'DocumentNotFoundError') {
                response.status(404).send(`Could not find event with ID ${commentId}`)
            } else {
                response.status(500).send(`Could not mark event ${commentId} as read by user ${user.email}: ${error.message}`)
            }
        })
})

module.exports = router