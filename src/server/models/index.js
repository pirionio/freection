const thinky = require('thinky')()
const type = thinky.type

const Thing = thinky.createModel('Thing', {
    id: type.string(),
    createdAt: type.date().required(),
    creator: type.string().required(),
    assignee: type.string().required(),
    body: type.string(),
    subject: type.string().required(),
    readList: [{
        user: type.string().required(),
        isRead: type.boolean().required(),
        readAt: type.date()
    }]
})

module.exports = {Thing}