const thinky = require('./thinky')
const type = thinky.type


const User = thinky.createModel('User', {
    id: type.string(),
    createdAt: type.date().required(),
    googleId: type.string().required(),
    email: type.string().required(),
    username: type.string().required(),
    organization: type.string().required(),
    firstName: type.string().required(),
    lastName: type.string().required(),
    accessToken: type.string(),
    refreshToken: type.string(),
    lastFetchedEmailDate: type.date(),
    integrations: {
        github: {
            active: type.boolean(),
            accessToken: type.string(),
            userId: type.string(),
            repositories: [{
                fullName: type.string()
            }]
        }
    }
})

User.ensureIndex('googleId')
User.ensureIndex('email')
User.ensureIndex('githubUserId', function(doc) {
    return doc('integrations')('github')('userId')
})
User.ensureIndex('organization')

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
                    repositories: user('integrations')('github')('repositories')
                        .append({
                            fullName: fullName
                        })
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
                    repositories: user('integrations')('github')('repositories')
                        .filter(repository => repository('fullName').ne(fullName))
                }
            }
        }
    }).run()
})

User.defineStatic('getUserByGithubId', function(githubId) {
    return this.getAll(githubId, {index:'githubUserId'}).run().then(users => {
        if (users.length == 0)
            throw "NotFound"

        return users[0]
    })
})

User.defineStatic('getOrganizationUsers', function (organization) {
    return this.getAll(organization, {index:'organization'}).run()
})

module.exports = User
