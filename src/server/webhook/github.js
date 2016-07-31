const router = require('express').Router()
const {toString} = require('lodash')

const ThingService = require('../shared/application/thing-service')
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
        const {title, body, number} = payload.issue
        const githubUserId = toString(payload.assignee.id)
        const fullName = payload.repository.full_name

        User.getUserByGithubId(githubUserId)
            .then(user => {
                if (user.integrations.github.active &&
                    user.integrations.github.repositories.map(repo => repo.fullName).includes(fullName)) {
                    logger.info(`creating new thing for issue ${fullName}/${number}`)
                    return ThingService.newThing(user, user.email, title, body)
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

