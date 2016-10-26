import classAutobind from 'class-autobind'

import TestConstants from '../test-constants'
import EventTypes from '../../common/enums/event-types'

export default class DummyDataStore {
    constructor() {
        classAutobind(this, DummyDataStore.prototype)
        
        this.creator = {
            id: TestConstants.CREATOR_ID,
            username: TestConstants.CREATOR_USERNAME,
            email: TestConstants.CREATOR_EMAIL,
            firstName: 'John',
            lastName: 'Creator'
        }

        this.doer = {
            id: TestConstants.DOER_ID,
            username: TestConstants.DOER_USERNAME,
            email: TestConstants.DOER_EMAIL,
            firstName: 'John',
            lastName: 'Doer'
        }

        this.mentionedUser = {
            id: TestConstants.MENTIONED_USER_ID,
            username: TestConstants.MENTIONED_USER_USERNAME,
            email: TestConstants.MENTIONED_USER_EMAIL,
            firstName: 'Jane',
            lastName: 'Mentioned'
        }
    }

    generateThing(thing) {
        return Object.assign({}, {
            id: TestConstants.THING_1_ID,
            type: 'THING',
            subject: 'The Subject',
            body: 'The Body',
            creator: this.creator,
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
}