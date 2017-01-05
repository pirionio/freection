import {union, uniq, some, trimEnd} from 'lodash'

import watson from 'watson-developer-cloud'

import * as ThingDomain from '../domain/thing-domain'
import * as EventCreator from './event-creator'
import {botToAddress} from './address-creator'
import GeneralConfig from '../config/general'
import WatsonConfig from '../config/watson'
import {NlpConstancts} from '../constants'
import promisify from '../utils/promisify'
import logger from '../utils/logger'

const alchemyLanguage = watson.alchemy_language({
    api_key: WatsonConfig.alchemyAppKey
})

promisify(alchemyLanguage, ['combined'])

export async function analyzeThingEvent(thing, event) {
    if (!event.payload.text)
        return

    let combinedResult = null

    try {
        combinedResult = await alchemyLanguage.combinedAsync({
            extract: 'keywords,concepts,entities',
            text: event.payload.text
        })
    } catch (error) {
        logger.warn(`Error while analyzing thing ${thing.id} in Watson Alchemy:`, error)
    }

    if (!combinedResult)
        return

    if (!thing.payload.nlp)
        thing.payload.nlp = {
            keywords: [],
            concepts: [],
            entities: []
        }

    // This is important in order to later search similar keywords case-insensitive.
    // I simply didn't manage to create an index in the DB on this field that would be case-insensitive.
    combinedResult.keywords.forEach(keyword => {
        keyword.textLowerCase = keyword.text.toLowerCase()
    })

    thing.payload.nlp.keywords = uniq(union(thing.payload.nlp.keywords, combinedResult.keywords))
    thing.payload.nlp.concepts = uniq(union(thing.payload.nlp.concepts, combinedResult.concepts))
    thing.payload.nlp.entities = uniq(union(thing.payload.nlp.entities, combinedResult.entities))
}

export async function checkThingSuggestions(user, thing) {
    if (!thing.payload || !thing.payload.nlp || !thing.payload.nlp.keywords)
        return

    for (var i = 0; i < thing.payload.nlp.keywords.length; i++) {
        const keyword = thing.payload.nlp.keywords[i]

        if (parseFloat(keyword.relevance) <= NlpConstancts.KEYWORD_RELEVANCE_BOUND)
            continue

        const relatedThings = await findRelatedThings(thing, keyword)
        const helpersString = findHelpers(user, relatedThings)

        if (relatedThings && relatedThings.length) {
            thing.events.push(EventCreator.createSuggestion(botToAddress(), thing, [user.id],
                'I found some older tasks that might be related.'))

            relatedThings.forEach(relatedThing => {
                thing.events.push(EventCreator.createComment(botToAddress(), new Date(), thing, [], [],
                    `Task ${relatedThing.subject} might be related`,
                    generateRelatedThingMessageHtml(relatedThing)))
            })
        }

        if (helpersString) {
            thing.events.push(EventCreator.createSuggestion(botToAddress(), thing, [user.id],
                'I found some people that might help you.'))
            thing.events.push(EventCreator.createComment(botToAddress(), new Date(), thing, [], [],
                `These people worked on similar tasks, they might help: ${helpersString}`,
                generateHelpersMessageHtml(helpersString)))
        }
    }
}

async function findRelatedThings(baseThing, baseKeyword) {
    const things = await ThingDomain.getThingsByKeyword(baseKeyword.text)

    return things.filter(thing => {
        return baseThing.id !== thing.id && some(thing.payload.nlp.keywords, keyword => {
                return keyword.text.toLowerCase() === baseKeyword.text.toLowerCase() &&
                    parseFloat(keyword.relevance) > NlpConstancts.KEYWORD_RELEVANCE_BOUND
            })
    })
}

function findHelpers(user, things) {
    const helpers = things
        .filter(thing => thing.to.id !== user.id)
        .map(thing => thing.to.payload.username ? `@${thing.to.payload.username}` : thing.to.displayName)

    return helpers && helpers.length ?
        trimEnd(helpers.join(', '), ', ') :
        null
}

function generateRelatedThingMessageHtml(thing) {
    return (
        `<div>
            <span>Task </span>
            <strong><a href="${GeneralConfig.BASE_URL}/inbox/${thing.id}">${thing.subject}</a></strong> 
            <span> might be relevant.</span>
        </div>`
    )
}

function generateHelpersMessageHtml(helpersString) {
    return (
        `<div>
            <div>These people worked on similar tasks, they might help:</div>
            <div><strong>${helpersString}</strong></div>
        </div>`
    )
}