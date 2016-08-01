const router = require('express').Router()
const {toString} = require('lodash')

const GithubThingService = require('../shared/application/github-thing-service')
const {User} = require('./../shared/models')
const logger = require('../shared/utils/logger')

router.post('/', function(request, response) {
    const eventType = request.get('X-GitHub-Event')

    switch (eventType) {
        case 'issues':
            handleIssues(request.body)
            break
        default:
            logger.info(`Github webook event arrived, type ${eventType}`)
    }

    response.sendStatus(200)
})

function handleIssues(payload) {
    const {action} = payload

    logger.info(`Github webook issue event arrived with action ${action}`)

    if (action === 'assigned') {
        const {title, body, number, html_url, id} = payload.issue
        const githubUserId = toString(payload.assignee.id)
        const fullName = payload.repository.full_name

        User.getUserByGithubId(githubUserId)
            .then(user => {
                if (user.integrations.github.active &&
                    user.integrations.github.repositories.map(repo => repo.fullName).includes(fullName)) {
                    logger.info(`creating new thing for issue ${fullName}/${number}`)

                    const creator = {
                        username: payload.issue.user.login,
                        avatarUrl: payload.issue.user.avatar_url,
                        url: payload.issue.user.html_url
                    }

                    const assigner = {
                        username: payload.sender.login,
                        avatarUrl: payload.sender.avatar_url,
                        url: payload.sender.html_url
                    }

                    return GithubThingService.newThing(creator, assigner, user, title, body, id, number, html_url)
                }
            })
            .catch(error => {
                if (error !== 'NotFound') {
                    logger.error('error while handling webhook event from github', error)
                }
                else {
                    logger.info(`user ${githubUserId} is not integrated with freection`)
                }
            })
    }
}

module.exports = router

