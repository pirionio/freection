const router = require('express').Router()

const ThingsService = require('../../services/things-service')
const logger = require('../../utils/logger')

router.get('/whatsnew', function(request, response) {
    const user = request.user

    ThingsService.getWhatsNew(user)
        .then(events => response.json(events))
        .catch(error => response.status(500).send(`Could not fetch What's New for user ${user.email}: ${error.message}`))
})

router.get('/do', function(request, response) {
    const user = request.user

    ThingsService.getToDo(user)
        .then(things => response.json(things))
        .catch(error => response.status(500).send(`Could not fetch To Do for user ${user.email}: ${error.message}`))
})

router.post('/do', function(request, response) {
    const user = request.user
    const {thingId, eventId} = request.body

    ThingsService.doThing(user, thingId, eventId)
        .then(() => response.json({}))
        .catch(error => {
            if (error && error.name === 'DocumentNotFoundError') {
                response.status(404).send(`Could not find Thing with ID ${thingId}`)
            } else {
                response.status(500).send(`Could not save user ${user.email} as a doer of thing ${thingId}: ${error.message}`)
            }
        })
})

router.post('/done', function(request, response) {
    const user = request.user
    const {thingId} = request.body

    ThingsService.completeThing(user, thingId)
        .then(() => response.json({}))
        .catch(error => {
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

    ThingsService.getFollowUps(user)
        .then(things => response.json(things))
        .catch(error => response.status(500).send(`Could not fetch Follow Ups for user ${user.email}: ${error.message}`))
})

router.post('/:thingId/comments', function(request, response) {
    const user = request.user
    const {thingId} = request.params
    const {commentText} = request.body

    ThingsService.createComment(user, thingId, commentText)
        .then(comment => response.json(comment))
        .catch(error => response.status(500).send(`Could not comment on thing ${thingId}: ${error.message}`))
})

module.exports = router