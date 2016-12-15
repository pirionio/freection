import requireText from 'require-text'
import {find} from 'lodash'

import * as ThingService from './thing-service'
import {botToAddress} from './address-creator'
import * as ThingDomain from '../domain/thing-domain'
import {BOT} from '../constants'
import EventTypes from '../../../common/enums/event-types'
import UserTypes from '../../../common/enums/user-types'
import * as ThingHelper from '../../../common/helpers/thing-helper'

const gettingStarted01 = requireText('../templates/getting-started/getting-started01.html', require)
const gettingStarted02 = requireText('../templates/getting-started/getting-started02.html', require)
const gettingStarted03 = requireText('../templates/getting-started/getting-started03.html', require)
const gettingStarted04 = requireText('../templates/getting-started/getting-started04.html', require)
const followUp01 = requireText('../templates/follow-up/follow-up01.html', require)
const followUp02 = requireText('../templates/follow-up/follow-up02.html', require)
const followUp03 = requireText('../templates/follow-up/follow-up03.html', require)

const freectionBot = botToAddress()

export async function onboard(user) {
    const thing = await ThingService.newThing(BOT.EMAIL, user.email, {subject: BOT.GETTING_STARTED_FLOW_SUBJECT, html: gettingStarted01})
    return await ThingService.comment(freectionBot, thing.id, {html: gettingStarted02})
}

export async function continueGettingStartedFlow(thing, event) {
    if (event.eventType === EventTypes.ACCEPTED.key) {
        await ThingService.comment(freectionBot, thing.id, {html: gettingStarted03})
    }
    if (event.eventType === EventTypes.DONE.key) {
        await ThingService.comment(freectionBot, thing.id, {html: gettingStarted04})
        await ThingService.newThing(freectionBot, thing.to.payload.email, {subject: BOT.FOLLOW_UP_FLOW_SUBJECT, html: followUp01})
    }
}

export async function continueFollowUpFlow(thing, event) {
    if (event.eventType === EventTypes.CREATED.key) {
        await ThingService.comment(freectionBot, thing.id, {html: followUp02})
        await closeFollowUpOriginalThing(thing.creator)
    }
    if (event.eventType === EventTypes.COMMENT.key && event.creator.type !== UserTypes.BOT.key) {
        await ThingService.markAsDone(freectionBot, thing.id, {html: followUp03})
    }
}

export async function closeFollowUpOriginalThing(user) {
    const userThings = await ThingDomain.getAllUserThings(user.id)
    const originalThing = find(userThings, {subject: BOT.FOLLOW_UP_FLOW_SUBJECT})
    if (originalThing) {
        ThingHelper.discardUserEvents(user, originalThing)
        await ThingDomain.updateThing(originalThing)
    }
}