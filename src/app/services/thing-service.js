import isString from 'lodash/isString'
import has from 'lodash/has'
import get from 'lodash/get'
import fromPairs from 'lodash/fromPairs'
import {chain} from 'lodash'

import EntityTypes from '../../common/enums/entity-types.js'
import ThingStatus from '../../common/enums/thing-status.js'
import ThingCommandActionTypes from '../actions/types/thing-command-action-types.js'

export function getThingAllowedCommands(thing, commands) {
    const allowedCommands = getAllAllowedCommands(thing)

    return chain(commands)
        .filter(command => has(allowedCommands, command))
        .map(command => get(allowedCommands, command))
        .value()
}

function getAllAllowedCommands(thing) {
    const allowedCommandArray = getAllAllowedCommandsArray(thing)

    return fromPairs(allowedCommandArray.map(command => {
        if (isString(command)) {
            return [command, {
                commandType: command, requireText: false
            }]
        }

        return [command.commandType, command]
    }))
}

function getSlackAllowedCommands(thing) {
    if (thing.isCreator) {
        switch (thing.payload.status) {
            case ThingStatus.NEW:
            case ThingStatus.INPROGRESS:
                return [ThingCommandActionTypes.CLOSE]
        }
    }

    return []
}

function getAllAllowedCommandsArray(thing) {
    if (thing.type.key === EntityTypes.SLACK.key) {
        return getSlackAllowedCommands(thing)
    }

    if (thing.isTo && thing.isCreator) {
        switch (thing.payload.status) {
            case ThingStatus.NEW.key:
            case ThingStatus.REOPENED.key:
            case ThingStatus.INPROGRESS.key:
                return [ThingCommandActionTypes.MARK_AS_DONE]
            default:
                return []
        }
    }

    if (thing.isTo) {
        switch (thing.payload.status) {
            case ThingStatus.NEW.key:
            case ThingStatus.REOPENED.key:
                return [
                    ThingCommandActionTypes.DO_THING,
                    requireText(ThingCommandActionTypes.MARK_AS_DONE),
                    requireText(ThingCommandActionTypes.DISMISS)]
            case ThingStatus.INPROGRESS.key:
                return [
                    requireText(ThingCommandActionTypes.MARK_AS_DONE),
                    requireText(ThingCommandActionTypes.DISMISS)]
            default:
                return []
        }
    }

    if (thing.isCreator) {
        const followUpAction = thing.isFollowUper ? ThingCommandActionTypes.UNFOLLOW : ThingCommandActionTypes.FOLLOW_UP

        switch (thing.payload.status) {
            case ThingStatus.NEW.key:
            case ThingStatus.REOPENED.key:
                return [requireText(ThingCommandActionTypes.CANCEL), followUpAction]
            case ThingStatus.INPROGRESS.key:
                return [requireText(ThingCommandActionTypes.CANCEL), ThingCommandActionTypes.PING, followUpAction]
            case ThingStatus.DONE.key:
            case ThingStatus.DISMISS.key:
                return [ThingCommandActionTypes.CLOSE,
                    requireText(ThingCommandActionTypes.SEND_BACK)]
            default:
                return []
        }
    }

    if (thing.isFollowUper) {
        switch (thing.payload.status) {
            case ThingStatus.NEW.key:
            case ThingStatus.REOPENED.key:
            case ThingStatus.INPROGRESS.key:
                return [ThingCommandActionTypes.UNFOLLOW]
            case ThingStatus.DONE.key:
            case ThingStatus.DISMISS.key:
            case ThingStatus.CLOSE.key:
                return [ThingCommandActionTypes.CLOSED_UNFOLLOW]
        }
    }

    if (thing.isSubscriber) {
        switch (thing.payload.status) {
            case ThingStatus.NEW.key:
            case ThingStatus.REOPENED.key:
            case ThingStatus.INPROGRESS.key:
                return [ThingCommandActionTypes.FOLLOW_UP, ThingCommandActionTypes.MUTE]
            case ThingStatus.DONE.key:
            case ThingStatus.DISMISS.key:
            case ThingStatus.CLOSE.key:
                return [ThingCommandActionTypes.MUTE]
        }
    }

    if (thing.isMentioned) {
        switch (thing.payload.status) {
            case ThingStatus.NEW.key:
            case ThingStatus.REOPENED.key:
            case ThingStatus.INPROGRESS.key:
                return [ThingCommandActionTypes.FOLLOW_UP, ThingCommandActionTypes.UNMUTE]
            case ThingStatus.DONE.key:
            case ThingStatus.DISMISS.key:
            case ThingStatus.CLOSE.key:
                return [ThingCommandActionTypes.UNMUTE]
        }
    }

    return []
}

function requireText(command) {
    return { commandType: command, requireText: true}
}