import {Event} from '../shared/models'
import logger from '../shared/utils/logger'
import UserTypes from '../../common/enums/user-types'
import * as BotService from '../shared/application/bot-service'
import * as ThingDomain from '../shared/domain/thing-domain'
import {BOT} from '../shared/constants'

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
                    await BotService.continueGettingStartedFlow(thing, event)
                }
            }
            if (thing && thing.to && thing.to.type === UserTypes.BOT.key) {
                await BotService.continueFollowUpFlow(thing, event)
            }
        }
    }
}

