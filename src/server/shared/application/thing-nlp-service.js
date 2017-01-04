import {union, uniq, some} from 'lodash'

import watson from 'watson-developer-cloud'

import * as ThingDomain from '../domain/thing-domain'
import * as EventCreator from './event-creator'
import {botToAddress} from './address-creator'
import GeneralConfig from '../config/general'
import WatsonConfig from '../config/watson'
import {NlpConstancts} from '../constants'
import promisify from '../utils/promisify'

const alchemyLanguage = watson.alchemy_language({
    api_key: WatsonConfig.alchemyAppKey
})

promisify(alchemyLanguage, ['combined'])

export async function analyzeThingEvent(thing, event) {
    if (!event.payload.text)
        return

    const combinedResult = await alchemyLanguage.combinedAsync({
        extract: 'keywords,concepts,entities',
        text: event.payload.text
    })

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

        const relatedThings = await ThingDomain.getThingsByKeyword(keyword.text)

        const relevantThings = relatedThings.filter(relatedThing => {
            return relatedThing.id !== thing.id && some(relatedThing.payload.nlp.keywords, relatedKeyword => {
                    return relatedKeyword.text.toLowerCase() === keyword.text.toLowerCase() &&
                        parseFloat(relatedKeyword.relevance) > NlpConstancts.KEYWORD_RELEVANCE_BOUND
                })
        })

        if (relevantThings && relevantThings.length) {
            thing.events.push(EventCreator.createSuggestion(botToAddress(), thing, [user.id], 'I found some older tasks that might be related to this one.'))

            relevantThings.forEach(relevantThing => {
                thing.events.push(EventCreator.createComment(botToAddress(), new Date(), thing, [], [],
                    `Task ${relevantThing.subject} might be related`,
                    `<div>
                        <span>Task </span>
                        <strong><a href="${GeneralConfig.BASE_URL}/inbox/${relevantThing.id}">${relevantThing.subject}</a></strong> 
                        <span> might be relevant.</span>
                    </div>`))
            })
        }
    }
}
