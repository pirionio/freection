const thinky = require('./thinky')
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

Thing.ensureIndex('whatsnew', function(doc) {
    return doc('readList').filter({isRead:false}).map(function(r) {
        return r('user')
    })
}, {multi:true})

Thing.defineStatic('getWhatsNew', function(user) {
    return this.getAll(user, {index: 'whatsnew'})
})

module.exports = Thing