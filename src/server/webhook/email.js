import {fromPairs, trimStart, trimEnd, chain, uniq, first} from 'lodash'
import {Router} from 'express'
import AddressParser from 'email-addresses'

import logger from '../shared/utils/logger'
import {addCommentFromEmail} from '../shared/application/thing-service'
import * as EmailService from '../shared/application/email-service'
import {User} from '../shared/models'
import {EmailConstants} from '../shared/constants'

const router = Router()

const GMAIL_ORIGIN_REGEX = /^from mail\S*\.google\.com.*$/
const GMAIL_ADDRESS_IN_BODY_REGEX = /"mailto:(\S+)"/gm

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

router.post('/forward', async function(request, response) {
    const {from, subject, 'body-html': body, 'References': referencesString, 'Message-Id': messageId, 'Received': received} = request.body

    logger.info(`Incoming forwarded email from ${from}`)

    if (!received || !received.length || !received[0].match(GMAIL_ORIGIN_REGEX)) {
        logger.warn(`Could not create a task for forwarded email from ${from} because the origin is not trusted, origin: ${received}`)
        response.send(406).message('Email forward received from untrusted origin')
        return
    }

    try {
        const emailAddress = AddressParser.parseOneAddress(from)
        const user = await User.getUserByEmail(emailAddress.address)

        const references = referencesString ? referencesString.split(' ') : []

        const originalMessageId = references && references.length ? first(references) : messageId
        const recipients = extractRecipientsFromBody(user, body)

        await EmailService.newEmailThingFromForward(user, {
            mimeMessageId: originalMessageId,
            subject: trimStart(subject, 'Fwd: '),
            recipients
        })

        response.sendStatus(200)
    } catch (error) {
        if (error === 'NotFound') {
            const message = `Could not create a task for forwarded email from ${from} - a corresponding user does not exist in Freection`
            logger.warn(message)
            response.status(406).send(message)
        } else {
            const message = `Error occurred while creating task for forwarded email from ${from}: ${error.message}`
            logger.error(message, error)
            response.status(500).send(message)
        }
    }
})

function extractRecipientsFromBody(user, body) {
    const matches = []
    let match
    while(match = GMAIL_ADDRESS_IN_BODY_REGEX.exec(body)) {
        matches.push(match[1])
    }

    return chain(matches)
        .filter(address => address !== user.email && address !== EmailConstants.EMAIL_FORWARD_ADDRESS)
        .uniq()
        .map(address => {
            return {
                emailAddress: address,
                name: address
            }
        })
        .value()
}

export default router