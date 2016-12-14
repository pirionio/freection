import {Router} from 'express'
import {toString, some, chain, startsWith} from 'lodash'

import {User} from './../shared/models'
import * as ThingDomain from '../shared/domain/thing-domain'
import * as ExternalThingService from '../shared/application/external-thing-service'
import ThingStatus from '../../common/enums/thing-status'
import logger from '../shared/utils/logger'
import UserTypes from '../../common/enums/user-types'
import ThingSource from '../../common/enums/thing-source.js'
import * as AsanaService from '../shared/technical/asana-service'

const router = Router()

router.post('/:userId', async function(request, response) {
    const {userId} = request.params

    const secret = request.get('X-Hook-Secret')

    if (secret) {
        response.set('X-Hook-Secret', secret)
        response.sendStatus(200)
        return
    }

    try {
        const {events} = request.body
        const removedStories = events.filter(event => event.type === 'story' && event.action === 'removed').map(event => event.resource)

        const stories = events.filter(event => event.type === 'story' && event.action === 'added' && !removedStories.includes(event.resource))

        if (stories && stories.length > 0) {
            logger.info(`Asana - ${stories.length} stories arrived`)

            const user = await User.get(userId)
            const client = AsanaService.createClient(user)

            // We use for of instead of forEach because we want the processing to by sync and in order
            for (const story of stories) {
                await handleStory(client, user, story)
            }

            logger.info(`Asana - processing of ${stories.length} completed`)
        }

        response.sendStatus(200)
    }
    catch (error) {
        logger.error('Error while handling asana webhook', error)
        response.sendStatus(500)
    }
})

async function handleStory(client, user, event) {
    try {
        const story = await client.stories.findById(event.resource)
        logger.info(`Asana - new story arrived, type: ${story.type}, text: ${story.text}`)

        if (shouldHandle(story)) {
            const creator = {
                id: toString(story.created_by.id),
                type: UserTypes.ASANA.key,
                displayName: story.created_by.name,
                payload: {}
            }

            const asanaTaskId = toString(story.target.id)

            const asanaTask = await client.tasks.findById(asanaTaskId)
            const thing = await ThingDomain.getUserThingByExternalId(asanaTaskId, user.id)

            if (isTaskAssign(story))
                await handleTaskAssign(user, thing, asanaTask, creator)
            else if (isTaakUnassign(story))
                await handleTaskUnassign(user, thing, asanaTask, creator)
            else if (isTaskCompleted(story))
                await handleTaskCompleted(user, thing, asanaTask, creator)
        }
    } catch(error) {
        // story might already be removed
        if (error.message === 'Not Found')
            logger.info('Asana - story already deleted')
        else
            throw error
    }
}

async function handleTaskAssign(user, thing, asanaTask, creator) {
    if (!asanaTask.completed && !thing) {
        await ExternalThingService.newThing(creator, user, asanaTask.name, asanaTask.notes, toString(asanaTask.id),
            `https://app.asana.com/0/${asanaTask.projects[0].id}/${asanaTask.id}`, ThingSource.ASANA.key)
        logger.info(`Asana - new task created for user ${user.email}`)

    } else if (!asanaTask.completed && thing && [ThingStatus.DONE.key, ThingStatus.DISMISS.key, ThingStatus.CLOSE.key].includes(thing.payload.status)) {
        await ExternalThingService.sendBack(creator, user, thing.id)
        logger.info(`Asana - task ${asanaTask.id} reassigned to user ${user.email} by ${creator.displayName}`)

    } else if (thing) {
        logger.info(`Asana - thing already existed for the task ${user.email}`)
    }
}

async function handleTaskUnassign(user, thing, asanaTask, creator) {
    if (!asanaTask.completed && thing && thing.to.id === user.id) {
        await ExternalThingService.unassign(user, creator, thing.id)
        logger.info(`Asana - unassigning user ${user.email} from thing ${thing.id} by user ${creator.displayName}`)
    }
}

async function handleTaskCompleted(user, thing, asanaTask, creator) {
    if (asanaTask.completed && thing &&
        [ThingStatus.NEW.key, ThingStatus.INPROGRESS.key, ThingStatus.REOPENED.key].includes(thing.payload.status)) {

        await ExternalThingService.markAsDoneByExternal(creator, thing)
        logger.info(`Asana - thing completed for user ${user.email} by ${creator.displayName}`)
    }
}

function isTaskAssign(story) {
    return story.text === 'assigned to you'
}

function isTaakUnassign(story) {
    return story.text === 'unassigned from you' || (startsWith(story.text, 'assigned to') && story.text !== 'assigned to you')
}

function isTaskCompleted(story) {
    return story.text === 'completed this task'
}

function shouldHandle(story) {
    return story.type === 'system' && (isTaskAssign(story) || isTaakUnassign(story) || isTaskCompleted(story))
}

export default router