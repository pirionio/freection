const router = require('express').Router()
const {Thing,User} = require('../../models')
const _ = require('lodash')

router.get('/things', function(request, response) {
    const userId = request.user.id
    User.
        get(userId).run().
        then(user => Thing.getWhatsNew(user.id)).
        then(things => {
            response.json(things.map(thing => {return {
                id: thing.id,
                createdAt: thing.createdAt,
                creator: _.pick(thing.creator, ['id', 'firstName', 'lastName', 'email']),
                assignee: _.pick(thing.assignee, ['id', 'firstName', 'lastName', 'email']),
                subject: thing.subject,
                body: thing.body
            }}))
        }).
        catch(e=> {
            console.log(e)
            response.sendStatus(500)
        })
})

module.exports = router