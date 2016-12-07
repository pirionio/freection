import thinky from './thinky'

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
    imapJoinDate: type.date(),
    integrations: {
        github: {
            active: type.boolean(),
            accessToken: type.string(),
            userId: type.string(),
            repositories: [{
                fullName: type.string()
            }]
        },
        slack: {
            active: type.boolean(),
            accessToken: type.string(),
            teamId: type.string(),
            userId: type.string(),
            username: type.string()
        },
        asana: {
            active: type.boolean(),
            accessToken: type.string(),
            refreshToken: type.string(),
            userId: type.string(),
            projects: [{
                projectId: type.string(),
                webhookId: type.string()
            }]
        },
        gmail: {
            allowSendMail: type.boolean()
        }
    }
})

User.ensureIndex('googleId')
User.ensureIndex('email')
User.ensureIndex('username')
User.ensureIndex('organization')
User.ensureIndex('githubUserId', doc => {
    return doc('integrations')('github')('userId')
})
User.ensureIndex('slackUserId', doc => {
    return doc('integrations')('slack')('userId')
})

User.defineStatic('getUserByGoogleId', function(googleId) {
    return this.getAll(googleId, {index: 'googleId'}).run().then(users => {
        if (users.length === 0)
            throw 'NotFound'

        return users[0]
    })
})

User.defineStatic('getUserByEmail', function(email) {
    return this.getAll(email, {index: 'email'}).run().then(users => {
        if (users.length === 0)
            throw 'NotFound'

        return users[0]
    })
})

User.defineStatic('getUserByUsername', function(username) {
    return this.getAll(username, {index: 'username'}).run().then(users => {
        if (users.length === 0)
            throw 'NotFound'

        return users[0]
    })
})

User.defineStatic('appendAsanaProject', function(userId, projectId, webhookId)  {
    return this.get(userId).update(user => {
        return {
            integrations: {
                asana: {
                    projects: user('integrations')('asana')('projects').setInsert({
                        projectId,
                        webhookId
                    })
                }
            }
        }
    })
})

User.defineStatic('removeAsanaProject', function(userId, projectId)  {
    return this.get(userId).update(user => {
        return {
            integrations: {
                asana: {
                    projects: user('integrations')('asana')('projects')
                        .filter(project => project('projectId').ne(projectId))
                }
            }
        }
    }).run()
})

User.defineStatic('appendGithubRepository', function(userId, fullName) {
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

User.defineStatic('removeGithubRepository', function(userId, fullName) {
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
        if (users.length === 0)
            throw 'NotFound'

        return users[0]
    })
})

User.defineStatic('getUserBySlackId', function(slackId) {
    return this.getAll(slackId, {index:'slackUserId'}).run().then(users => {
        if (users.length === 0)
            throw 'NotFound'

        return users[0]
    })
})

User.defineStatic('getOrganizationUsers', function(organization) {
    return this.getAll(organization, {index:'organization'}).run()
})

export default User
