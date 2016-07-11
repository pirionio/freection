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
User.ensureIndex('email')

User.defineStatic('getUserByGoogleId', function(googleId) {
  return this.getAll(googleId, {index: 'googleId'}).run().then(users => {
      if (users.length == 0)
          throw "NotFound"

      return users[0]
  })
})

User.defineStatic('getUserByEmail', function(email) {
    return this.getAll(email, {index:'email'}).run().then(users => {
        if (users.length == 0)
            throw "NotFound"

        return users[0]
    })
})

module.exports = User
