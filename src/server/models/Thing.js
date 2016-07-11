const thinky = require('./thinky')
const type = thinky.type
const User = require('./User')

const Thing = thinky.createModel('Thing', {
    id: type.string(),
    createdAt: type.date().required(),
    creatorUserId: type.string().required(),
    assigneeUserId: type.string().required(),
    body: type.string(),
    subject: type.string().required(),
    readList: [{
        userId: type.string().required(),
        isRead: type.boolean().required(),
        readAt: type.date()
    }]
})

Thing.belongsTo(User, "creator", "creatorUserId", "id")
Thing.belongsTo(User, "assignee", "assigneeUserId", "id")

Thing.ensureIndex('whatsnew', function(doc) {
    return doc('readList').filter({isRead:false}).map(function(r) {
        return r('userId')
    })
}, {multi:true})

Thing.defineStatic('getWhatsNew', function(user) {
    return this.getAll(user, {index: 'whatsnew'}).getJoin({creator:true, assignee:true}).run()
})

module.exports = Thing