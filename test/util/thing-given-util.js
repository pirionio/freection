import {expect} from 'chai'
import sinon from 'sinon'
import 'sinon-as-promised'
import {nth, isUndefined} from 'lodash'

import EventTypes from '../../src/common/enums/event-types'
import ThingStatus from '../../src/common/enums/thing-status'

let ThingService, ThingDomainMock, UserMock, EventMock, EmailMock

export function setupThingMocks() {
    ThingDomainMock = {
        createThing: sinon.stub(),
        updateThing: sinon.stub(),
        getFullThing: sinon.stub()
    }
    EventMock = {}
    UserMock = {
        getUserByEmail: sinon.stub(),
        getUserByUsername: sinon.stub()
    }
    EmailMock = {
        sendMessage: sinon.stub()
    }

    return [ThingDomainMock, EventMock, UserMock, EmailMock]
}

export function setupThingService() {
    ThingService = require('../../src/server/shared/application/thing-service')
    return ThingService
}

export function cleanThingMocks() {
    ThingDomainMock.createThing.reset()
    ThingDomainMock.updateThing.reset()
    ThingDomainMock.getFullThing.reset()
    UserMock.getUserByEmail.reset()
    UserMock.getUserByUsername.reset()
    EmailMock.sendMessage.reset()
}

const given = {
    basic: () => {
        Given(function() {
            ThingDomainMock.createThing.returnsArg(0)
            ThingDomainMock.updateThing.returnsArg(0)
            ThingDomainMock.getFullThing.resolves({})
            UserMock.getUserByEmail.resolves(doer)
            UserMock.getUserByUsername.resolves(mentionedUser)
            EmailMock.sendMessage.resolves({})
        })
    },
    notFreectionUser: () => {
        Given(function() {
            UserMock.getUserByEmail.returns(Promise.reject('NotFound'))
        })
    },
    userIsCreator: () => {
        Given(function() {
            UserMock.getUserByEmail.resolves(creator)
        })
    },
    thingInNew: () => {
        Given(function() {
            ThingDomainMock.getFullThing.resolves(generateThing({
                payload: {
                    status: ThingStatus.NEW.key
                },
                followUpers: [creator.id],
                events: [
                    generateCreatedEvent(creator, 'Thing-1', [doer.id])
                ]
            }))
        })
    },
    thingInDo: () => {
        Given(function() {
            ThingDomainMock.getFullThing.resolves(generateThing({
                payload: {
                    status: ThingStatus.INPROGRESS.key
                },
                followUpers: [creator.id],
                doers: [doer.id],
                events: [
                    generateCreatedEvent(creator, 'Thing-1', []),
                    generateAcceptedEvent(doer, 'Thing-1', [])
                ]
            }))
        })
    }
}

const when = {
    newThing: (to, body) => {
        When('thing', function() {
            return ThingService.newThing(creator, to, 'The Subject', body)
        })
    },
    doThing: () => {
        When('thing', function() {
            return ThingService.doThing(doer, 'Thing-1')
        })
    },
    dismissThing: () => {
        When('thing', function() {
            return ThingService.dismiss(doer, 'Thing-1', 'Dismiss message')
        })
    }
}

const then = {
    statusIs: status => {
        Then('is in status NEW', function() {
            expect(this.thing.payload).to.exist
            expect(this.thing.payload.status).to.equal(status)
        })
    },
    creatorIsFollowUpper: () => {
        Then('creator is a follow upper', function() {
            expect(this.thing.followUpers).to.exist
            expect(this.thing.followUpers).to.have.lengthOf(1)
            expect(this.thing.followUpers[0]).to.equal(creator.id)
        })
    },
    creatorIsDoer: () => {
        Then('creator is a doer', function() {
            expect(this.thing.doers).to.have.lengthOf(1)
            expect(this.thing.doers).to.include(creator.id)
        })
    },
    creatorIsNotFollowUpper: () => {
        Then('creator is not a follow upper', function() {
            expect(this.thing.followUpers).to.have.lengthOf(0)
        })
    },
    recipientIsDoer: () => {
        Then('recipient is a doer', function() {
            expect(this.thing.doers).to.have.lengthOf(1)
            expect(this.thing.doers).to.have.include(doer.id)
        })
    },
    recipientIsNotDoer: () => {
        Then('doer is not a doer anymore', function() {
            expect(this.thing.doers).to.have.lengthOf(0)
        })
    },
    noSubscribers: () => {
        Then('recipient is not a sucscriber', function() {
            expect(this.thing.subscribers).to.exist
            expect(this.thing.subscribers).to.have.lengthOf(0)
        })
    },
    eventCreated: (numOfEvents, eventType, messageText, notificationIndex = -1) => {
        Then(`event ${eventType} is created`, function() {
            expect(this.thing.events).to.have.lengthOf(numOfEvents)
            expect(nth(this.thing.events, notificationIndex).eventType).to.equal(eventType)
            expect(nth(this.thing.events, notificationIndex).payload).to.exist

            if (!isUndefined(messageText))
                expect(nth(this.thing.events, notificationIndex).payload.text).to.equal(messageText)
        })
    },
    creatorReceivedNotification: (eventType, notificationIndex = -1) => {
        Then(`creator receives a ${eventType} notification`, function() {
            expect(nth(this.thing.events, notificationIndex).showNewList).to.have.lengthOf(1)
            expect(nth(this.thing.events, notificationIndex).showNewList).to.include(creator.id)
        })
    },
    doerReceivedNotification: (eventType, notificationIndex = -1) => {
        Then(`recipient receives a ${eventType} notification`, function() {
            expect(nth(this.thing.events, notificationIndex).showNewList).to.have.lengthOf(1)
            expect(nth(this.thing.events, notificationIndex).showNewList).to.include(doer.id)
        })
    },
    noOneReceivedNotification: (eventType, notificationIndex = -1) => {
        Then(`no one receives the ${eventType} notification`, function() {
            expect(nth(this.thing.events, notificationIndex).showNewList).to.have.lengthOf(0)
        })
    },
    creatorReadNotification: (notificationIndex = -1) => {
        Then('text is marked as read for the creator', function() {
            expect(nth(this.thing.events, notificationIndex).payload.readByList).to.have.lengthOf(1)
            expect(nth(this.thing.events, notificationIndex).payload.readByList).to.include(creator.id)
        })
    },
     notificationDiscardedForDoer: (eventType, notificationIndex = -1) => {
        Then(`the ${eventType} notification is discarded for the doer`, function() {
            expect(nth(this.thing.events, notificationIndex).showNewList).to.not.include(doer.id)
        })
    },
    userIsMentioned: () => {
        Then('mentioned user appears as mentioned', function() {
            expect(this.thing.mentioned).to.exist
            expect(this.thing.mentioned).to.have.lengthOf(1)
            expect(this.thing.mentioned).to.include(mentionedUser.id)
        })
    },
    mentionedUserIsSubscribed: () => {
        Then('mentioned user is subscribed to notifications', function() {
            expect(this.thing.subscribers).to.exist
            expect(this.thing.subscribers.length).to.equal(1)
            expect(this.thing.subscribers[0]).to.equal(mentionedUser.id)
        })
    },
    mentionedUserReceivedNotification: notificationIndex => {
        Then('mentioned user receives a notification', function() {
            expect(this.thing.events[notificationIndex].payload).to.exist
            expect(this.thing.events[notificationIndex].payload.mentioned).to.have.lengthOf(1)
            expect(this.thing.events[notificationIndex].payload.mentioned).to.include(mentionedUser.id)
        })
    },
    emailIsSent: () => {
        Then('email is sent', function() {
            expect(EmailMock.sendMessage.calledOnce).to.be.true
        })
    }
}

const creator = {
    id: 'ID-creator',
    username: 'john.creator',
    email: 'john.creator@freection.com',
    firstName: 'John',
    lastName: 'Creator'
}

const doer = {
    id: 'ID-doer',
    username: 'john.doer',
    email: 'john.doer@freection.com',
    firstName: 'John',
    lastName: 'Doer'
}

const mentionedUser = {
    id: 'ID-mentioned',
    username: 'jane.mentioned',
    email: 'jane.mentioned@freection.com',
    firstName: 'Jane',
    lastName: 'Mentioned'
}

function generateThing(thing) {
    return Object.assign({}, {
        id: 'Thing-1',
        type: 'THING',
        subject: 'The Subject',
        body: 'The Body',
        creator: creator,
        payload: {},
        doers: [],
        followUpers: [],
        mentioned: [],
        subscribers: [],
        all: [],
        events: []
    }, thing)
}

function generateCreatedEvent(creator, thingId, showNewList) {
    return {
        id: 'Event-Created-1',
        thingId,
        eventType: EventTypes.CREATED.key,
        creator,
        showNewList
    }
}

function generateAcceptedEvent(creator, thingId, showNewList) {
    return {
        id: 'Event-Accepted-1',
        thingId,
        eventType: EventTypes.ACCEPTED.key,
        creator,
        showNewList
    }
}

export {
    given,
    when,
    then
}
