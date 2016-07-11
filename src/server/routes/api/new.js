const router = require('express').Router()
const {Thing, User} = require('../../models')

router.post('/', function(request, response) {
    const {assignee, body, subject} = request.body
    const creatorUserId = request.user.id

    if (!assignee) {
        response.status(400).send("assignee field is missing")
        return
    }

    if (!subject) {
        response.status(400).send("subject field is missing")
        return
    }

    User.
        getUserByEmail(assignee).
        then(user => {
            const assigneeUserId = user.id;

            return Thing.save({
                createdAt: new Date(),
                creatorUserId,
                assigneeUserId,
                body,
                subject,
                readList: [{userId: assigneeUserId, isRead:false}]
            })
        }).
        then(()=> response.sendStatus(200)).
        catch(e => {
            if (e === "NotFound")
                response.status(404).send(`user ${assignee} doesn't exist`)
            else
                response.sendStatus(500)
        })
})

module.exports = router