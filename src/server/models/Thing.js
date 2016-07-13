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
    followers: [type.string()]
})

Thing.belongsTo(User, "creator", "creatorUserId", "id")
Thing.belongsTo(User, "to", "toUserId", "id")


module.exports = Thing