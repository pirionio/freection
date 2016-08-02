const router = require('express').Router()
const querystring = require('querystring')
const fetch = require('node-fetch')
const {chain, toString} = require('lodash')

const { User } = require('../../shared/models')
const logger = require('../../shared/utils/logger')
const config = require('../../shared/config/github')

const githubAPIUrl = 'https://api.github.com'

router.get('/', function(request, response) {
    const {user} = request

    User.get(user.id).run()
        .then(checkGithubActivated)
        .then(user => {
            return getRepos(user.integrations.github.accessToken)
                .then(repositories => {
                    const userRepositories = (user.integrations.github.repositories || []).map(repository => repository.fullName)

                    response.json({
                        active: true,
                        clientID: config.clientID,
                        repositories: repositories.map(
                            repository => repositoryToDTO(repository, userRepositories))
                    })
                })
        })
        .catch(error => {
            if (error === 'GithubNotActivated')
                response.json({active: false})
            else {
                logger.error(`error while getting user github info for user ${user.email}`, error)
                response.status(500).send('error while getting user github info')
            }
        })
})

router.get('/integrate', function (request, response) {
    const redirectUrl = generateOAuth2Url()
    response.redirect(302, redirectUrl)
})

router.get('/callback', function (request, response) {
    const {code} = request.query
    const {user} = request

    getAccessTokenFromGithub(code)
            .then(accessToken => {
                getUserId(accessToken)
                    .then(githubUserId => activateGithubForUser(user.id, githubUserId, accessToken))
                    .then(() => logger.info(`user ${user.email} integrated github`))
                    .then(() => response.redirect('/integrations/github'))
                    .catch(error => {
                        logger.error(`error while integrating github for user ${user.email}`, error)
                        response.sendStatus(500)
                    })
        })
})

router.post('/enableRepository/:owner/:name', function(request, response) {
    const {owner, name} = request.params
    const fullName = `${owner}/${name}`

    User.get(request.user.id).run()
        .then(checkGithubActivated)
        .then(user => {
            return writeHook(user.integrations.github.accessToken, fullName)
                .catch(error => {
                    if (error.status != 422) // We ignore hook is already created
                        throw error
                })
        })
        .then(() => User.appendGithubRepository(request.user.id, fullName))
        .then(() => logger.info(`user ${request.user.email} enabled github repository ${fullName}`))
        .then(() => response.json({}))
        .catch(error => {
            logger.error(`error while enabling github repository for user ${request.user.email}`, error)
            response.status(500).send('error while enabling github repository')
        })
})

router.post('/disableRepository/:owner/:name', function(request, response) {
    const {owner, name} = request.params
    const fullName = `${owner}/${name}`

    User.removeGithubRepository(request.user.id, fullName)
        .then(() => logger.info(`user ${request.user.email} disabled github repository ${fullName}`))
        .then(() => response.json({}))
        .catch(error => {
            logger.error(`error while disabling github repository for user ${request.user.email}`, error)
            response.status(500).send('error while enabling github repository')
        })
})

function generateOAuth2Url() {
    const oauthUrl = 'https://github.com/login/oauth/authorize'
    const scope = [
        'write:repo_hook',
        'repo']

    const options = {
        client_id: config.clientID,
        redirect_uri: config.callbackURL,
        scope: scope.join(' '),
        allow_signup: false
    }

    return oauthUrl + '?' + querystring.stringify(options)
}

function getAccessTokenFromGithub(code) {
    const params = {
        client_id: config.clientID,
        client_secret: config.clientSecret,
        code
    }

    return fetch(`https://github.com/login/oauth/access_token?${querystring.stringify(params)}`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(json => json.access_token)
}

function activateGithubForUser(userId, githubUserId, accessToken) {
    return User.get(userId)
        .update({
            integrations:
            {
                github: {
                    active: true,
                    userId: toString(githubUserId),
                    accessToken: accessToken,
                    repositories: []
                }
            }
        })
        .run()
}

function repositoryToDTO(repository, userRepositories) {
    return {
        fullName: repository.full_name,
        name: repository.name,
        owner: repository.owner.login,
        enabled: userRepositories.includes(repository.full_name)
    }
}

function checkGithubActivated(user) {
    if (user.integrations && user.integrations.github && user.integrations.github.active)
        return user
    else
        throw "GithubNotActivated"
}

function getUserId(access_token) {
    return githubRequest(access_token, 'GET', 'user')
        .then(response => response.json())
        .then(json => json.id)
}

function getRepos(access_token) {
    return githubRequest(access_token, 'GET', 'user/repos')
        .then(response => response.json())
}

function writeHook(access_token, fullName) {
    return githubRequest(access_token, 'POST', `repos/${fullName}/hooks`, {
        active: true,
        name: 'web',
        events: ['issues', 'issue_comment'],
        config: {
            url: config.webhookURL,
            content_type: 'json'
        }
    })
        .then(response => response.json())
        .then(json => json.id)
}

function githubRequest(access_token, method, path, body) {
    return fetch(`${githubAPIUrl}/${path}`, {
        method: method,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `token ${access_token}`
        },
        body: JSON.stringify(body)
    })
        .then(response => {
            if (response.status >= 200 && response.status < 400)
                return response
            else {
                return response.text().then(text => {
                    const error = new Error(response.statusText)
                    error.response = text
                    error.status = response.status
                    throw error
                })
            }
        })
}

module.exports = router