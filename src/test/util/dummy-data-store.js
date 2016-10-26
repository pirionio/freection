import classAutobind from 'class-autobind'

import TestConstants from '../test-constants'
import EventTypes from '../../common/enums/event-types'
import UserTypes from '../../common/enums/user-types'

export default class DummyDataStore {
    constructor() {
        classAutobind(this, DummyDataStore.prototype)
        
        this.creator = {
            id: TestConstants.CREATOR_ID,
            username: TestConstants.CREATOR_USERNAME,
            email: TestConstants.CREATOR_EMAIL,
            firstName: 'John',
            lastName: 'Creator',
            type: UserTypes.FREECTION.key
        }

        this.doer = {
            id: TestConstants.DOER_ID,
            username: TestConstants.DOER_USERNAME,
            email: TestConstants.DOER_EMAIL,
            firstName: 'John',
            lastName: 'Doer',
            type: UserTypes.FREECTION.key
        }

        this.mentionedUser = {
            id: TestConstants.MENTIONED_USER_ID,
            username: TestConstants.MENTIONED_USER_USERNAME,
            email: TestConstants.MENTIONED_USER_EMAIL,
            firstName: 'Jane',
            lastName: 'Mentioned',
            type: UserTypes.FREECTION.key
        }
    }

    generateThing(thing) {
        return Object.assign({}, {
            id: TestConstants.THING_1_ID,
            type: 'THING',
            subject: 'The Subject',
            body: 'The Body',
            creator: this.creator,
            to: this.doer,
            payload: {},
            doers: [],
            followUpers: [],
            mentioned: [],
            subscribers: [],
            all: [],
            events: []
        }, thing)
    }

    generateCreatedEvent(creator, thingId, showNewList) {
        return {
            id: TestConstants.EVENT_CREATED_ID,
            thingId,
            eventType: EventTypes.CREATED.key,
            creator,
            showNewList
        }
    }

    generateAcceptedEvent(creator, thingId, showNewList) {
        return {
            id: TestConstants.EVENT_ACCEPTED_ID,
            thingId,
            eventType: EventTypes.ACCEPTED.key,
            creator,
            showNewList
        }
    }

    generateDoneEvent(creator, thingId, showNewList) {
        return {
            id: TestConstants.EVENT_ACCEPTED_ID,
            thingId,
            eventType: EventTypes.DONE.key,
            creator,
            showNewList
        }
    }

    generateDismissedEvent(creator, thingId, showNewList) {
        return {
            id: TestConstants.EVENT_DISMISSED_ID,
            thingId,
            eventType: EventTypes.DISMISSED.key,
            creator,
            showNewList
        }
    }

    generateReopenedEvent(creator, thingId, showNewList) {
        return {
            id: TestConstants.EVENT_REOPENED_ID,
            thingId,
            eventType: EventTypes.SENT_BACK.key,
            creator,
            showNewList
        }
    }
}