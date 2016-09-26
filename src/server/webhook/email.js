import {fromPairs, trimStart, trimEnd} from 'lodash'
import {Router} from 'express'

import logger from '../shared/utils/logger'
import {addCommentFromEmail} from '../shared/application/thing-service'

const router = Router()

function trimMessageId(id) {
    return trimEnd(trimStart(id, '<'), '>')
}

function getThingIdFromTo(to) {
    const start = to.indexOf('+') + 1
    const length = to.indexOf('@') - start

    return to.substr(start, length)
}

router.post('/', async function (request, response) {
    const {from, subject, 'stripped-text': text, 'stripped-html': html, 'message-headers': headersString} = request.body

    const headers = fromPairs(JSON.parse(headersString))
    const { Date: date, 'Message-Id': messageIdUntrimmed, To: to } = headers
    const messageId = trimMessageId(messageIdUntrimmed)
    const thingId = getThingIdFromTo(to)

    try {
        await addCommentFromEmail(thingId, messageId, from, date, text, html)
        logger.info(`Comment from email from ${from} on ${subject}`)
        response.sendStatus(200)
    } catch(error) {
        logger.error('error while handling email webhook', error)
        response.send(500)
    }
})

export default router