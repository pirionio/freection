const thinky = require('./thinky')
const type = thinky.type

const User = thinky.createModel('User', {
    id: type.string(),
    createdAt: type.date().required(),
    googleId: type.string().required(),
    email: type.string().required(),
    firstName: type.string().required(),
    lastName: type.string().required(),
    accessToken: type.string().required(),
    refreshToken: type.string().required()
})

User.ensureIndex('googleId')

module.exports = User
