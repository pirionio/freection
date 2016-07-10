const router = require('express').Router()
const {Thing} = require('../../models')

/* assignee, body, subject, isread, creator*/

router.post('/', function(request, response) {
    const {assignee, body, subject} = request.body

    if (!assignee) {
        response.status(400).send("assignee field is missing")
        return
    }

    if (!subject) {
        response.status(400).send("subject field is missing")
        return
    }

    Thing.save({
        createdAt: new Date(),
        creator:'user', // HARD CODED user
        assignee: assignee,
        body: body,
        subject: subject,
        readList: [{user: assignee, isRead:false}]
    }).then(() => {
        response.sendStatus(200)
    }).error(e => {
        console.log(e)
        response.sendStatus(500)
    })
})

module.exports = router