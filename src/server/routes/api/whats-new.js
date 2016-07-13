const router = require('express').Router()
const {Event,User} = require('../../models')
const _ = require('lodash')
const logger = require('../../utils/logger')

router.get('/things', function(request, response) {
    const userId = request.user.id
    User.
        get(userId).run().
        then(user => Event.getWhatsNew(user.id)).
        then(events => {
            response.json(
                events.map(event => {
                    return {
                        eventId: event.id,
                        thingId: event.thing.id,
                        createdAt: event.createdAt,
                        creator: _.pick(event.thing.creator, ['id', 'firstName', 'lastName', 'email']),
                        to: _.pick(event.thing.to, ['id', 'firstName', 'lastName', 'email']),
                        subject: event.thing.subject,
                        body: event.thing.body
            }}))
        }).
        catch(e=> {
            logger.error('error while fetching whats new', e)
            response.sendStatus(500)
        })
})

module.exports = router