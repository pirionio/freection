const router = require('express').Router()

const ThingsService = require('../../shared/services/things-service')
const logger = require('../../shared/utils/logger')

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

router.post('/:thingId/do', function(request, response) {
    const user = request.user
    const {thingId} = request.params

    ThingsService.doThing(user, thingId)
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

    ThingsService.dismissThing(user, thingId)
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

    ThingsService.markThingAsDone(user, thingId)
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

    ThingsService.closeThing(user, thingId)
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

    ThingsService.abortThing(user, thingId)
        .then(() => response.json({}))
        .catch(error => {
            if (error && error.name === 'DocumentNotFoundError') {
                response.status(404).send(`Could not find thing with ID ${thingId}`)
            } else {
                response.status(500).send(`Could not abort thing ${thingId} by user ${user.email} : ${error.message}`)
            }
        })
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

router.post('/:thingId/discardcomments', function(request, response) {
    const user = request.user
    const {thingId} = request.params

    ThingsService.discardComments(user, thingId)
        .then(() => response.json({}))
        .catch(error => {
            if (error && error.name === 'DocumentNotFoundError') {
                response.status(404).send(`Could not find Thing with ID ${thingId}`)
            } else {
                response.status(500).send(`Could not discard comments unread by user ${user.email} for thing ${thingId}: ${error.message}`)
            }
        })
})

router.post('/:commentId/markcommentasread', function(request, response) {
    const {user} = request
    const {commentId} = request.params

    ThingsService.markCommentAsRead(user, commentId)
        .then(() => response.json({}))
        .catch(error => {
            if (error && error.name === 'DocumentNotFoundError') {
                response.status(404).send(`Could not find comment with ID ${commentId}`)
            } else {
                response.status(500).send(`Could not mark comment as read by user ${user.email} for comment ${commentId}: ${error.message}`)
            }
        })
})

module.exports = router