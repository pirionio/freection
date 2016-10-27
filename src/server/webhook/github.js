import {Router} from 'express'
import {toString} from 'lodash'

import {User} from './../shared/models'
import * as ThingDomain from '../shared/domain/thing-domain'
import * as GithubThingService from '../shared/application/github-thing-service'
import ThingStatus from '../../common/enums/thing-status'
import logger from '../shared/utils/logger'
import UserTypes from '../../common/enums/user-types'

const router = Router()

router.post('/', (request, response) => {
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

    ThingDomain.getThingsByGithubIssueId(id, true)
        .then(things => {

            const creator = {
                id: payload.sender.login,
                type: UserTypes.GITHUB.key,
                displayName: payload.sender.login,
                payload: {
                    avatarUrl: payload.sender.avatar_url,
                    url: payload.sender.html_url
                }
            }

            things.forEach(thing => {
                if (thing.payload.status === ThingStatus.INPROGRESS.key) {
                    logger.info(`marking thing as done by github ${fullName}/${number}`)
                    GithubThingService.markAsDone(creator, thing)
                } else if ((thing.payload.status === ThingStatus.NEW.key)) {
                    logger.info(`closing thing by github ${fullName}/${number}`)
                    GithubThingService.closeByGithub(creator, thing)
                }
            })
        })
}

function handleAssigned(payload) {
    const {title, body, number, html_url, id, state} = payload.issue
    const githubUserId = toString(payload.assignee.id)
    const fullName = payload.repository.full_name

    // We only handle issues with state set to open
    if (state !== 'open')
        return

    User.getUserByGithubId(githubUserId)
        .then(user => isRepositoryEnabled(user, fullName))
        .then(user => {
            return ThingDomain.getThingsByGithubIssueId(id)
                .then(things => isNewThing(user, things))
                .then(() => {
                    logger.info(`creating new thing for issue ${fullName}/${number}`)

                    const creator = {
                        id: payload.issue.user.login,
                        type: UserTypes.GITHUB.key,
                        displayName: payload.issue.user.login,
                        payload: {
                            avatarUrl: payload.issue.user.avatar_url,
                            url: payload.issue.user.html_url
                        }
                    }

                    return GithubThingService.newThing(creator, user, title, body, id, number, html_url)
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
    if (things.map(thing => thing.to.id).includes(user.id))
        throw 'ThingAlreadyExist'
}

export default router

