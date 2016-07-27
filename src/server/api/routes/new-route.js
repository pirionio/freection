const router = require('express').Router()

const {Thing, User, Event} = require('../../shared/models')
const EventTypes = require('../../../common/enums/event-types')
const ThingTypes = require('../../../common/enums/thing-types')
const ThingStatus = require('../../../common/enums/thing-status')
const logger = require('../../shared/utils/logger')

router.post('/', function(request, response) {
    const {to, body, subject} = request.body
    const {id: creatorUserId, email: creatorEmail} = request.user

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
                followUpers: [creatorUserId],
                doers: [],
                type: ThingTypes.TASK.key,
                payload: {
                    status: ThingStatus.NEW.key
                }
            })
        }).
        then(thing => {
            return Event.save({
                thingId: thing.id,
                eventType: EventTypes.CREATED.key,
                createdAt,
                creatorUserId,
                payload: {},
                showNewList: [thing.toUserId]
            })
        }).
        then(() => {
            logger.info(`new thing from ${creatorEmail} to ${to} subject ${subject}`)
            response.json({})
        }).
        catch(e => {
            if (e === "NotFound")
                response.status(404).send(`user ${to} doesn't exist`)
            else {
                logger.error("error while saving new thing", e)
                response.sendStatus(500)
            }
        })
})

module.exports = router