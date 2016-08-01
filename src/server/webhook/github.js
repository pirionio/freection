const router = require('express').Router()
const {toString} = require('lodash')

const GithubThingService = require('../shared/application/github-thing-service')
const ThingStatus = require('../../common/enums/thing-status')
const {User, Thing} = require('./../shared/models')
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
        handleAssigned(payload)
    } else if (action === 'closed') {
        handleClosed(payload)
    }
}

function handleClosed(payload) {
    const { id, number} = payload.issue
    const fullName = payload.repository.full_name

    Thing.getThingsByGithubIssueId(id)
        .then(things => {
            things.forEach(thing => {
                if (thing.payload.status === ThingStatus.INPROGRESS.key) {
                    logger.info(`marking thing as done by github ${fullName}/${number}`)
                    GithubThingService.markAsDone(thing)
                } else if ((thing.payload.status === ThingStatus.NEW.key)) {
                    logger.info(`closing thing by github ${fullName}/${number}`)
                    GithubThingService.closeByGithub(thing)
                }
            })
        })
}

function handleAssigned(payload) {
    const {title, body, number, html_url, id, state} = payload.issue
    const githubUserId = toString(payload.assignee.id)
    const fullName = payload.repository.full_name

    // We only handle issues with state set to open
    if (state != 'open')
        return

    User.getUserByGithubId(githubUserId)
        .then(user => isRepositoryEnabled(user, fullName))
        .then(user => {
            return Thing.getThingsByGithubIssueId(id)
                .then(things => isNewThing(user, things))
                .then(() => {
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
                })
        })
        .catch(error => {
            if (error === 'NotFound')
                logger.info(`user ${githubUserId} is not integrated with freection`)
            else if (error === 'ThingAlreadyExist')
                logger.info(`Thing for issue ${fullName}/#${number} already exist`, error)
            else if (error === 'RepositoryNotEnabled')
                logger.info(`Repository ${fullName} is not enabled`, error)
            else
                logger.error('error while handling webhook event from github', error)
        })
}

function isRepositoryEnabled(user, fullName) {
    if (!(user.integrations.github.active &&
        user.integrations.github.repositories.map(repo => repo.fullName).includes(fullName)))
        throw 'RepositoryNotEnabled'

    return user
}

function isNewThing(user, things) {
    if (things.map(thing => thing.toUserId).includes(user.id))
        throw 'ThingAlreadyExist'
}

module.exports = router

