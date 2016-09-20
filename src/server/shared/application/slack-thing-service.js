import { Thing } from '../models'
import * as EventCreator from './event-creator'
import {userToAddress} from './address-creator'
import EventTypes from '../../../common/enums/event-types'
import EntityTypes from '../../../common/enums/entity-types'
import ThingStatus from '../../../common/enums/thing-status'

export async function newThing(creator, to, subject) {
    const creatorAddresss = userToAddress(creator)

    const thing = await saveNewThing(creatorAddresss, to, subject)
    await EventCreator.createCreated(creatorAddresss, thing, getShowNewList)
}

function saveNewThing(creator, to, subject, body, id, number, url) {
    return Thing.save({
        createdAt: new Date(),
        creator,
        to,
        body,
        subject,
        followUpers: [],
        doers: [],
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
            return []
        default:
            throw 'UnknownEventType'
    }
}