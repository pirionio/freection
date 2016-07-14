const thinky = require('./thinky')
const type = thinky.type
const User = require('./User')

const Thing = thinky.createModel('Thing', {
    id: type.string(),
    createdAt: type.date().required(),
    creatorUserId: type.string().required(),
    toUserId: type.string().required(),
    body: type.string(),
    subject: type.string().required(),
    doers:[type.string()],
    followUpers: [type.string()]
})

Thing.belongsTo(User, "creator", "creatorUserId", "id")
Thing.belongsTo(User, "to", "toUserId", "id")

Thing.ensureIndex('followUpers', function(doc) {
    return doc('followUpers')
}, {multi:true})

Thing.ensureIndex('doers', function(doc) {
    return doc('doers')
}, {multi:true})

Thing.defineStatic('getUserFollowUps', function(userId) {
    return this.getAll(userId, {index: 'followUpers'}).getJoin({to: true, creator: true}).run()
})

Thing.defineStatic('getUserToDos', function(userId) {
    return this.getAll(userId, {index: 'doers'}).getJoin({creator: true, to: true}).run()
})

module.exports = Thing