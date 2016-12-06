import requireText from 'require-text'

import {Event, Thing} from '../shared/models'
import {botToAddress} from '../shared/application/address-creator'
import logger from '../shared/utils/logger'
import UserTypes from '../../common/enums/user-types'
import EventTypes from '../../common/enums/event-types'
import * as ThingDomain from '../shared/domain/thing-domain'
import * as ThingService from '../shared/application/thing-service'
import {BOT} from '../shared/constants'

const gettingStarted02 = requireText('../shared/templates/getting-started/getting-started02.html', require)
const gettingStarted03 = requireText('../shared/templates/getting-started/getting-started03.html', require)

const freectionBot = botToAddress()

export async function configure() {
    const changes = await Event.changes()
    changes.each(handleEvent)
}

async function handleEvent(error, event) {
    if (error) {
        logger.error('Error while bot reads events', error)
    } else {
        const oldValue = event.getOldValue()
        const isSaved = event.isSaved()

        if (event && !oldValue && isSaved) {
            const thing = await ThingDomain.getFullThing(event.thingId)
            if (thing && thing.creator && thing.creator.type === UserTypes.BOT.key) {
                if (thing.subject === BOT.GETTING_STARTED_FLOW_SUBJECT) {
                    await handleGettingStarted(thing, event)
                }
            }
        }
    }
}

async function handleGettingStarted(thing, event) {
    if (event.eventType === EventTypes.ACCEPTED.key) {
        await ThingService.comment(freectionBot, thing.id, {html: gettingStarted02})
    }
    if (event.eventType === EventTypes.DONE.key) {
        await ThingService.comment(freectionBot, thing.id, {html: gettingStarted03})
    }
}
