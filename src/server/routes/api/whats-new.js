const router = require('express').Router()
const {Thing} = require('../../models')

router.get('/things', function(request, response) {
    Thing.filter(t=> t('readList').contains({user:'user', isRead: false})).
        run().then(r=> {
        response.json(r.map(t=> {return {
            id: t.id,
            createdAt: t.createdAt,
            creator: t.creator,
            assignee: t.assignee,
            subject: t.subject,
            body: t.body
        }}))
    }).error(e=> {
        console.log(e)
        response.sendStatus(500)
    })
})

module.exports = router