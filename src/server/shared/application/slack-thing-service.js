import {remove, uniq} from 'lodash'

import {} from '../models'
import * as ThingDomain from '../domain/thing-domain'
import * as EventCreator from './event-creator'
import {userToAddress} from './address-creator'
import EventTypes from '../../../common/enums/event-types'
import EntityTypes from '../../../common/enums/entity-types'
import ThingStatus from '../../../common/enums/thing-status'
import logger from '../utils/logger'

export async function newThing(creator, to, subject) {
    const creatorAddresss = userToAddress(creator)

    const thing = await saveNewThing(creatorAddresss, to, subject)
    thing.events.push(EventCreator.createCreated(creatorAddresss, thing, []))

    return await ThingDomain.updateThing(thing)
}

export async function close(user, thingId) {
    const creator = userToAddress(user)

    try {
        const thing = await ThingDomain.getFullThing(thingId)

        // Removing the user from the doers and follow upers
        remove(thing.followUpers, followUperId => followUperId === user.id)

        // Creating the close event and saving to DB
        thing.events.push(EventCreator.createClosed(creator, thing, []))

        // saving the thing
        return await ThingDomain.updateThing(thing)
    } catch(error) {
        logger.error(`error while closing slack-thing ${thingId} by user ${user.email}:`, error)
        throw error
    }
}

function saveNewThing(creator, to, subject, body, id, number, url) {
    return ThingDomain.createThing({
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
        },
        events: []
    })
}
