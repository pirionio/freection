import querystring from 'querystring'

import {flatten, toString, chain, find} from 'lodash'
import {Router} from 'express'

import { User } from '../../shared/models'
import logger from '../../shared/utils/logger'
import config from '../../shared/config/asana'
import {post} from '../../../app/util/resource-util.js'
import * as AsanaService from '../../shared/technical/asana-service'
import UserTypes from '../../../common/enums/user-types'
import ThingSource from '../../../common/enums/thing-source'
import * as ExternalThingService from '../../shared/application/external-thing-service'
import {AsanaConstants} from '../../shared/constants'

const router = Router()
const oauthUrl = 'https://app.asana.com/-/oauth_authorize'

router.get('/', async function (request, response) {
    try {
        const user = await User.get(request.user.id)

        if (user.integrations && user.integrations.asana && user.integrations.asana.active) {

            const projects = await getProjects(user)

            response.json({active: true, projects})
        }
        else
            response.json({ active: false })
    } catch(error) {
        logger.error(`error while getting Asana info for user ${request.user.email}`, error)
        response.status(500).send('error while getting user Asana info')
    }
})

router.get('/webhooks', async function (request, response) {
    try {
        const user = await User.get(request.user.id)
        const client = AsanaService.createClient(user)

        const organizations = await getOrganizations(client)

        response.json(await collectionToArray(await client.webhooks.getAll(organizations[0].id)))

    } catch(error) {
        logger.error(`error while getting Asana webhooks for user ${request.user.email}`, error)
        response.status(500).send('error while getting Asana webhooks')
    }
})

router.post('/enableProject/:projectId', async function (request, response) {
    const {projectId} = request.params

    if (!projectId) {
        response.status(400).send('Project id is missing')
        return
    }

    try {
        const user = await User.get(request.user.id)
        const client = AsanaService.createClient(user)
        const webhook = await client.webhooks.create(projectId, `${config.webhookURL}/${request.user.id}`)

        fetchUserTasks(user, client, projectId)
        
        await User.appendAsanaProject(request.user.id, toString(projectId), toString(webhook.id))
        response.json({})
    } catch(error) {
        logger.error(`error while enabling Asana project for user ${request.user.email}`, error)
        response.status(500).send('error while enabling Asana project')
    }
})

async function fetchUserTasks(user, client, projectId) {
    logger.info(`Asana - fetching tasks for user ${user.email} for project ${projectId}`)

    const userTasks = await client.tasks.findByProject(projectId, {
        opt_fields: 'id,name,notes,assignee,created_by.id,created_by.name,completed',
        limit: AsanaConstants.FETCH_LIMIT
    })

    for (let i = 0; i < userTasks.data.length; i++) {
        const task = userTasks.data[i]

        if (task.assignee && user && user.integrations && user.integrations.asana &&
            task.assignee.id.toString() === user.integrations.asana.userId &&
            !task.completed) {

            const creator = {
                id: toString(task.created_by.id),
                type: UserTypes.ASANA.key,
                displayName: task.created_by.name,
                payload: {}
            }

            const thing = await ExternalThingService.newThing(creator, user, task.name, task.notes, toString(task.id),
                AsanaService.getTaskUrl(projectId, task.id), ThingSource.ASANA.key)

            await ExternalThingService.doThing(user, thing.id)

            logger.info(`Asana - created task for user ${user.email} by ${creator.displayName}`)
        }
    }
}

router.post('/disableProject/:projectId', async function (request, response) {
    const {projectId} = request.params

    if (!projectId) {
        response.status(400).send('Project id is missing')
        return
    }

    try {
        const user = await User.get(request.user.id)
        const project = chain(user.integrations.asana.projects)
            .filter(project => project.projectId === projectId)
            .head()
            .value()

        if (!project) {
            response.status(404).send('Project is not enabled')
            return
        }

        const client = AsanaService.createClient(user)

        await client.webhooks.deleteById(project.webhookId)
        await User.removeAsanaProject(request.user.id, toString(projectId))
        response.json({})
    } catch(error) {
        logger.error(`error while disabling Asana project for user ${request.user.email}`, error)
        response.status(500).send('error while disabling Asana project')
    }
})


router.get('/integrate', (request, response) => {

    const options = {
        client_id: config.clientID,
        redirect_uri: config.callbackURL,
        response_type: 'code'
    }

    const redirectUrl = `${oauthUrl}?${querystring.stringify(options)}`

    response.redirect(302, redirectUrl)
})

router.get('/callback', async function(request, response) {
    try {
        const {code} = request.query

        const body = {
            grant_type: 'authorization_code',
            client_id: config.clientID,
            client_secret: config.clientSecret,
            redirect_uri: config.callbackURL,
            code
        }

        const {refresh_token: refreshToken, access_token: accessToken} =
            await post('https://app.asana.com/-/oauth_token', body, {requestType: 'form'})

        const client = AsanaService.createClientFromToken(accessToken)

        const me = await client.users.me()

        await User.get(request.user.id).update({
            integrations: {
                asana: {
                    active: true,
                    accessToken,
                    refreshToken,
                    userId: toString(me.id),
                    projects: []
                }
            }
        }).run()

        response.redirect('/integrations/asana')
    } catch (error) {
        logger.error(`error while integrating Asana for user ${request.user.email}`, error)
        response.sendStatus(500)
    }
})

async function getTeams(client) {
    const organizations = await getOrganizations(client)

    const teams = await Promise.all(organizations.map(async function (organization) {
        const orgTeams = await collectionToArray(await client.teams.findByUser('me', {organization: organization.id}))

        return orgTeams.map(team => {
            return {
                id: team.id,
                name: team.name,
                organization: organization
            }
        })
    }))

    return flatten(teams)
}

async function getOrganizations(client) {
    const workspaces = await collectionToArray(await client.workspaces.findAll())

    const workspacesFull = await Promise.all(workspaces.map(workspace => client.workspaces.findById(workspace.id)))

    return workspacesFull.filter(workspace => workspace.is_organization)
}

async function getProjects(user) {
    const client = AsanaService.createClient(user)

    const teams = await getTeams(client)

    const userProjects = user.integrations.asana.projects.map(project => project.projectId)

    const projects = await Promise.all(teams.map(async function(team) {
        const teamProjects = await collectionToArray(await client.projects.findByTeam(team.id))

        return teamProjects.map(project => {
            const projectId = toString(project.id)

            return {
                id: projectId,
                name: project.name,
                team: team.name,
                organization: team.organization.name,
                enabled: userProjects.includes(projectId)
            }
        })
    }))

    return flatten(projects)
}

function collectionToArray(streamWrapper) {
    const stream = streamWrapper.stream()

    return new Promise((resolve, reject) => {
        const items = []

        stream.on('data', project => {
            items.push(project)
        })

        stream.on('end', () => resolve(items))

        stream.on('error', error => reject(error))
    })
}

export default router