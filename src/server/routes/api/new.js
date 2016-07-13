const router = require('express').Router()
const {Thing, User, Event} = require('../../models')

router.post('/', function(request, response) {
    const {to, body, subject} = request.body
    const creatorUserId = request.user.id

    if (!to) {
        response.status(400).send("to field is missing")
        return
    }

    if (!subject) {
        response.status(400).send("subject field is missing")
        return
    }

    const createdAt = new Date()

    User.getUserByEmail(to).
        then(user => {
            const toUserId = user.id

            return Thing.save({
                createdAt,
                creatorUserId,
                toUserId,
                body,
                subject,
                followers: [creatorUserId]
            })
        }).
        then(thing => {
            return Event.save({
                thingId: thing.id,
                type: Event.events.CREATED,
                createdAt,
                payload: {},
                readList: [{
                    userId: thing.toUserId,
                    isRead: false
                }]
            })
        }).
        then(() => response.sendStatus(200)).
        catch(e => {
            if (e === "NotFound")
                response.status(404).send(`user ${to} doesn't exist`)
            else {
                console.log(e)
                response.sendStatus(500)
            }
        })
})

module.exports = router