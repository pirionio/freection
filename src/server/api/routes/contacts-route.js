import Router from 'express'
import fetch from 'node-fetch'
import OAuth2 from 'google-auth-library/lib/auth/oauth2client'
import {reject, union, flatMap, take} from 'lodash'
import {WebClient} from '@slack/client';

import config from '../../shared/config/google-oauth'
import promisify from '../../shared/utils/promisify'
import {findUsers} from '../../shared/application/users-service'
import {User, SlackTeam} from '../../shared/models'
import UserTypes from '../../../common/enums/user-types'
import logger from '../../shared/utils/logger.js'
import {BOT} from '../../shared/constants'
import {botToAddress} from '../../shared/application/address-creator'

const router = Router()

router.get('/', async function(request, response) {

    try {
        const {query, max} = request.query
        const user = await User.get(request.user.id).run()

        // get both freection and google contacts
        const googleContactsPromise = getGoogleContacts(user, query, max)
        const slackContactsPromise = getSlackContacts(user, query, max)
        const freectionContacts = await findUsers(user, query)
        const googleContacts = await googleContactsPromise
        const slackContacts = await slackContactsPromise

        // filtering freection users from google contacts
        const freectionEmails = freectionContacts.map(contact => contact.payload.email)
        const googleWithoutFreection = reject(googleContacts,
            contact => freectionEmails.includes(contact.payload.email))

        const me = getMeOption(user, query)
        const bot = getBotOption(query)

        // merge, freection first
        const merged = union(me, bot, freectionContacts, slackContacts, googleWithoutFreection)
        const taken = take(merged, max)

        response.json(taken)
    } catch (error) {
        logger.error('error while fetching contacts', error)
        response.sendStatus(500)
    }
})

async function getSlackContacts(user, query) {
    if (!user.integrations.slack || !user.integrations.slack.active)
        return []

    try {
        const slackTeam = await SlackTeam.get(user.integrations.slack.teamId).run()
        const client = new WebClient(slackTeam.accessToken)
        const users = await client.users.list()

        return users.members.map(user => {
            return {
                id: user.id,
                type: UserTypes.SLACK.key,
                displayName: user.real_name || user.name,
                payload: {
                    username: user.name
                }
            }
        }).filter(user => user.displayName.toLowerCase().includes(query) || user.payload.username.toLowerCase().includes(query))

    } catch(error) {
        if (error.name === 'DocumentNotFoundError')
            return []

        throw error
    }
}

async function getGoogleContacts(user, query, max) {

    const accessToken = await getNewAccessToken(user)

    const fetchResponse = await fetch(
        `https://www.google.com/m8/feeds/contacts/default/full?alt=json&q=${query}&max-result=${max}&sorderby=lastmodified&sortorder=descending`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'GData-Version': '3.0'
            }
        })

    if (fetchResponse.status !== 200) {
        throw new Error(fetchResponse.statusText)
    }

    const json = await fetchResponse.json()

    if (!json.feed || !json.feed.entry)
        return []

    const filtered = json.feed.entry
        .filter(entry => {
            return entry['gd$name'] &&
                entry['gd$name']['gd$fullName'] &&
                entry['gd$name']['gd$fullName']['$t'] &&
                entry['gd$email'] && entry['gd$email'].length &&
                entry['gd$email'][0]['address']
        })


    const mapped = flatMap(filtered, entry => {
        return entry['gd$email'].map(email => {
            return {
                id: entry['gd$email'][0]['address'],
                type: UserTypes.EMAIL.key,
                displayName: entry['gd$name']['gd$fullName']['$t'],
                payload: {
                    email: email['address']
                }
            }
        })
    })

    return mapped
}

function getNewAccessToken(user) {
    const oauth2 = new OAuth2(config.clientID, config.clientSecret)
    promisify(oauth2, ['getAccessToken'])
    oauth2.setCredentials({refresh_token: user.refreshToken})
    return oauth2.getAccessTokenAsync()
}

function getMeOption(user, query) {
    const meName = 'Me'
    const shouldIncludeMe = meName.toLowerCase().includes(query) || user.email.toLowerCase().includes(query)
    return shouldIncludeMe ? [{
        id: user.id,
        type: UserTypes.FREECTION.key,
        displayName: 'Me',
        payload: {
            email: user.email
        }
    }] : []
}

function getBotOption(query) {
    return BOT.NAME.toLowerCase().includes(query) ? [botToAddress()] : []
}

export default router