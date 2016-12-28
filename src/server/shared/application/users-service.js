import {reject, chain} from 'lodash'

import {User, Thing} from '../models'
import {userToAddress} from './address-creator'
import {userToDto} from './transformers'
import * as EmailParsingUtility from '../utils/email-parsing-utility.js'
import ThingStatus from '../../../common/enums/thing-status.js'
import UserTypes from '../../../common/enums/user-types.js'
import EventTypes from '../../../common/enums/event-types.js'
import EntityTypes from '../../../common/enums/entity-types.js'
import WelcomeStatus from '../../../common/enums/welcome-status'
import logger from '../utils/logger.js'
import {onboard} from './bot-service'

export async function createNewUser({googleId, firstName, lastName, email, accessToken, refreshToken}) {
    const organization = EmailParsingUtility.getOrganization(email)
    const username = EmailParsingUtility.getUsername(email)

    const user = await User.save({
        createdAt: new Date(),
        googleId,
        username,
        organization,
        email,
        firstName: firstName,
        lastName: lastName,
        accessToken: accessToken,
        refreshToken: refreshToken,
        integrations: {},
        payload: {
            welcomeStatus: WelcomeStatus.INTRO.key
        }
    })

    //  search for user open things
    Thing.filter({
        type: EntityTypes.THING.key,
        creator: {
            payload: {
                organization: user.organization
            }
        },
        to: {
            id : email,
            type: UserTypes.EMAIL.key
        },
        payload: {
            status: ThingStatus.NEW.key
        }
    }).getJoin({events: true}).run()
        .then(things => {

            if (!things || things.length === 0)
                return

            return importThings(user, things)
        })
        .catch(error => logger.error(`Error thrown when importing new ${user.email} user things`, error))

    await onboard(user)

    return user
}

function importThings(user, things) {
    const address = userToAddress(user)

    const promises = things.map(thing => {
        thing.to = address
        thing.all.push(user.id)

        const createdEvent = chain(thing.events)
            .filter(event => event.eventType === EventTypes.CREATED.key)
            .head()
            .value()

        if (createdEvent) {
            if (!createdEvent.showNewList) {
                createdEvent.showNewList = [user.id]
            } else {
                createdEvent.showNewList.push(user.id)
            }
        }

        return thing.saveAll()
    })

    return Promise.all(promises).then(() =>
        logger.info(`import ${promises.length} things for user ${user.email}`))
}

export async function getUserProfile(userId) {
    const user = await User.get(userId)
    return userToDto(user)
}

export async function findUsers(user, query) {
    const users = await getUsers(user)

    return users.filter(user => user.displayName.toLowerCase().includes(query) || user.payload.email.toLowerCase().includes(query))
}

export async function getUsers(user) {
    if (user.organization === 'gmail.com')
        return [userToAddress(user)]

    const organizationsUsers = await User.getOrganizationUsers(user.organization)

    return organizationsUsers.map(userToAddress)
}

export async function setTodos(userId, todos) {
    const user = await User.get(userId).run()
    user.todos = todos
    const persistedUser = await user.save()
    return persistedUser.todos
}