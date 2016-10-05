import {remove, uniq} from 'lodash'

import { Thing } from '../models'
import * as EventCreator from './event-creator'
import {userToAddress} from './address-creator'
import EventTypes from '../../../common/enums/event-types'
import EntityTypes from '../../../common/enums/entity-types'
import ThingStatus from '../../../common/enums/thing-status'
import logger from '../utils/logger'

export async function newThing(creator, to, subject) {
    const creatorAddresss = userToAddress(creator)

    const thing = await saveNewThing(creatorAddresss, to, subject)
    await EventCreator.createCreated(creatorAddresss, thing, getShowNewList)
}

export async function close(user, thingId) {
    const creator = userToAddress(user)

    try {
        const thing = await Thing.get(thingId).run()

        // Removing the user from the doers and follow upers
        remove(thing.followUpers, followUperId => followUperId === user.id)

        // saving the thing
        await thing.save()

        // Creating the close event and saving to DB
        await EventCreator.createClosed(creator, thing, getShowNewList)
    } catch(error) {
        logger.error(`error while closing slack-thing ${thingId} by user ${user.email}:`, error)
        throw error
    }
}

function saveNewThing(creator, to, subject, body, id, number, url) {
    return Thing.save({
        createdAt: new Date(),
        creator,
        to,
        body,
        subject,
        followUpers: [creator.id],
        doers: [],
        all: uniq([creator.id, to.id]),
        type: EntityTypes.SLACK.key,
        payload: {
            status: ThingStatus.NEW.key,
            id,
            number,
            url
        }
    })
}

function getShowNewList(user, thing, eventType) {
    switch (eventType) {
        case EventTypes.CREATED.key:
        case EventTypes.CLOSED.key:
            return []
        default:
            throw 'UnknownEventType'
    }
}