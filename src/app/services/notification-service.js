import isString from 'lodash/isString'

import EntityTypes from '../../common/enums/entity-types.js'
import EventTypes from '../../common/enums/event-types'
import ThingCommandActionTypes from '../actions/types/thing-command-action-types.js'

export function getCommands(notification) {
    return getCommandsUnwrapped(notification).map(command => {
        if (isString(command)) {
            return {
                commandType: command, requireText: false
            }
        }

        return command
    })
}

function getCommandsUnwrapped(notification) {

    if ([EntityTypes.GITHUB.key, EntityTypes.EXTERNAL.key].includes(notification.thing.type.key)) {
        switch (notification.eventType.key) {
            case EventTypes.CREATED.key:
                return [ThingCommandActionTypes.DO_THING, ThingCommandActionTypes.DISMISS]
            case EventTypes.DONE.key:
                return [ThingCommandActionTypes.CLOSE]
            default:
                throw 'UnknownEventType'
        }
    }

    if (notification.thing.isTo) {
        switch (notification.eventType.key) {
            case EventTypes.CREATED.key:
            case EventTypes.SENT_BACK.key:
                return [
                    ThingCommandActionTypes.DO_THING,
                    createCommand(ThingCommandActionTypes.MARK_AS_DONE),
                    createCommand(ThingCommandActionTypes.DISMISS)]
            case EventTypes.CLOSED.key:
                return [ThingCommandActionTypes.CLOSE_ACK]
            case EventTypes.COMMENT.key:
                return [notification.payload.isMentioned ?
                        ThingCommandActionTypes.DISCARD_SINGLE_NOTIFICATION :
                        ThingCommandActionTypes.DISCARD_COMMENTS]
            case EventTypes.PING.key:
                return [createCommand(ThingCommandActionTypes.PONG, true), ThingCommandActionTypes.DISCARD_SINGLE_NOTIFICATION]
            default:
                throw 'UnknownEventType'
        }
    }

    if (notification.thing.isCreator) {
        switch (notification.eventType.key) {
            case EventTypes.DONE.key:
            case EventTypes.DISMISSED.key:
                return [ThingCommandActionTypes.CLOSE, createCommand(ThingCommandActionTypes.SEND_BACK)]
            case EventTypes.COMMENT.key:
                return [notification.payload.isMentioned ?
                        ThingCommandActionTypes.DISCARD_SINGLE_NOTIFICATION :
                        ThingCommandActionTypes.DISCARD_COMMENTS]
            case EventTypes.PONG.key:
                return [ThingCommandActionTypes.DISCARD_SINGLE_NOTIFICATION]
            default:
                throw 'UnknownEventType'
        }
    }

    if (notification.thing.isFollowUper) {
        switch (notification.eventType.key) {
            case EventTypes.DONE.key:
            case EventTypes.DISMISSED.key:
            case EventTypes.CLOSED.key:
                return [ThingCommandActionTypes.CLOSED_UNFOLLOW]
            case EventTypes.CREATED.key:
            case EventTypes.SENT_BACK.key:
                return [ThingCommandActionTypes.DISCARD_SINGLE_NOTIFICATION]
            case EventTypes.COMMENT.key:
                return [notification.payload.isMentioned ?
                        ThingCommandActionTypes.DISCARD_SINGLE_NOTIFICATION :
                        ThingCommandActionTypes.DISCARD_COMMENTS]
            default:
                throw 'UnknownEventType'
        }
    }

    // The rest...
    switch (notification.eventType.key) {
        case EventTypes.DONE.key:
        case EventTypes.DISMISSED.key:
        case EventTypes.CLOSED.key:
            return [ThingCommandActionTypes.DISCARD_SINGLE_NOTIFICATION]
        case EventTypes.CREATED.key:
        case EventTypes.SENT_BACK.key:
            return [ThingCommandActionTypes.FOLLOW_UP, ThingCommandActionTypes.DISCARD_SINGLE_NOTIFICATION]
        case EventTypes.COMMENT.key:
            if (notification.payload.isMentioned)
                return [ThingCommandActionTypes.FOLLOW_UP, ThingCommandActionTypes.DISCARD_SINGLE_NOTIFICATION]

            return [ThingCommandActionTypes.DISCARD_COMMENTS]
        default:
            throw 'UnknownEventType'
    }
}

function createCommand(command, requireText = false) {
    return { commandType: command, requireText}
}