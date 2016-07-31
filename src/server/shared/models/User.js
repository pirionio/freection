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
    refreshToken: type.string().required(),
    lastFetchedEmail: type.number().default('0'),
        integrations: {
        github: {
            active: type.boolean(),
            accessToken: type.string(),
            repositories: [type.string()]
        }
    }
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

User.defineStatic('appendGithubRepository', function (userId, fullName) {
    return this.get(userId).update(user => {
        return {
            integrations: {
                github: {
                    repositories: user('integrations')('github')('repositories').append(fullName)
                }
            }
        }
    }).run()
})

User.defineStatic('removeGithubRepository', function (userId, fullName) {
    return this.get(userId).update(user => {
        return {
            integrations: {
                github: {
                    repositories: user('integrations')('github')('repositories').filter(repository => repository.ne(fullName))
                }
            }
        }
    }).run()
})

module.exports = User
