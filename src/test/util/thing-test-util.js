import {expect} from 'chai'
import {nth, isUndefined} from 'lodash'

import TestConstants from '../test-constants'
import ThingStatus from '../../common/enums/thing-status'

export default class ThingTestUtil {
    constructor(mock, dataStore) {
        this.given = {
            basic: () => {
                Given(function () {
                    mock.initMocks()
                })
            },
            thingInNew: () => {
                Given(function () {
                    mock.ThingDomainMock.getFullThing.resolves(dataStore.generateThing({
                        payload: {
                            status: ThingStatus.NEW.key
                        },
                        followUpers: [dataStore.creator.id],
                        events: [
                            dataStore.generateCreatedEvent(dataStore.creator, TestConstants.THING_1_ID, [dataStore.doer.id])
                        ]
                    }))
                })
            },
            thingInReopened: () => {
                Given(function () {
                    mock.ThingDomainMock.getFullThing.resolves(dataStore.generateThing({
                        payload: {
                            status: ThingStatus.REOPENED.key
                        },
                        followUpers: [dataStore.creator.id],
                        events: [
                            dataStore.generateCreatedEvent(dataStore.creator, TestConstants.THING_1_ID, []),
                            dataStore.generateDismissedEvent(dataStore.creator, TestConstants.THING_1_ID, []),
                            dataStore.generateReopenedEvent(dataStore.creator, TestConstants.THING_1_ID, [dataStore.doer.id])
                        ]
                    }))
                })
            },
            thingInDo: () => {
                Given(function () {
                    mock.ThingDomainMock.getFullThing.resolves(dataStore.generateThing({
                        payload: {
                            status: ThingStatus.INPROGRESS.key
                        },
                        followUpers: [dataStore.creator.id],
                        doers: [dataStore.doer.id],
                        events: [
                            dataStore.generateCreatedEvent(dataStore.creator, TestConstants.THING_1_ID, []),
                            dataStore.generateAcceptedEvent(dataStore.doer, TestConstants.THING_1_ID, [])
                        ]
                    }))
                })
            },
            thingInDone: () => {
                Given(function () {
                    mock.ThingDomainMock.getFullThing.resolves(dataStore.generateThing({
                        payload: {
                            status: ThingStatus.DONE.key
                        },
                        followUpers: [dataStore.creator.id],
                        events: [
                            dataStore.generateCreatedEvent(dataStore.creator, TestConstants.THING_1_ID, []),
                            dataStore.generateAcceptedEvent(dataStore.doer, TestConstants.THING_1_ID, []),
                            dataStore.generateDoneEvent(dataStore.doer, TestConstants.THING_1_ID, [dataStore.creator.id])
                        ]
                    }))
                })
            },
            thingInDismissed: () => {
                Given(function () {
                    mock.ThingDomainMock.getFullThing.resolves(dataStore.generateThing({
                        payload: {
                            status: ThingStatus.DISMISS.key
                        },
                        followUpers: [dataStore.creator.id],
                        events: [
                            dataStore.generateCreatedEvent(dataStore.creator, TestConstants.THING_1_ID, []),
                            dataStore.generateAcceptedEvent(dataStore.doer, TestConstants.THING_1_ID, []),
                            dataStore.generateDismissedEvent(dataStore.doer, TestConstants.THING_1_ID, [dataStore.creator.id])
                        ]
                    }))
                })
            }
        }

        this.when = {
            newThing: (to, body) => {
                When('thing', function () {
                    return mock.ThingService.newThing(dataStore.creator, to, 'The Subject', body)
                })
            },
            doThing: () => {
                When('thing', function () {
                    return mock.ThingService.doThing(dataStore.doer, TestConstants.THING_1_ID)
                })
            },
            markThingAsDone: () => {
                When('thing', function () {
                    return mock.ThingService.markAsDone(dataStore.doer, TestConstants.THING_1_ID, 'Done message')
                })
            },
            dismissThing: () => {
                When('thing', function () {
                    return mock.ThingService.dismiss(dataStore.doer, TestConstants.THING_1_ID, 'Dismiss message')
                })
            },
            closeThing: () => {
                When('thing', function () {
                    return mock.ThingService.close(dataStore.creator, TestConstants.THING_1_ID, 'Close message')
                })
            },
            sendThingBack: () => {
                When('thing', function () {
                    return mock.ThingService.sendBack(dataStore.creator, TestConstants.THING_1_ID, 'Send back message')
                })
            }
        }

        this.then = {
            statusIs: status => {
                Then('is in status NEW', function () {
                    expect(this.thing.payload).to.exist
                    expect(this.thing.payload.status).to.equal(status)
                })
            },
            creatorIsFollowUpper: () => {
                Then('creator is a follow upper', function () {
                    expect(this.thing.followUpers).to.exist
                    expect(this.thing.followUpers).to.have.lengthOf(1)
                    expect(this.thing.followUpers[0]).to.equal(dataStore.creator.id)
                })
            },
            creatorIsDoer: () => {
                Then('creator is a doer', function () {
                    expect(this.thing.doers).to.have.lengthOf(1)
                    expect(this.thing.doers).to.include(dataStore.creator.id)
                })
            },
            creatorIsNotFollowUpper: () => {
                Then('creator is not a follow upper', function () {
                    expect(this.thing.followUpers).to.have.lengthOf(0)
                })
            },
            recipientIsDoer: () => {
                Then('recipient is a doer', function () {
                    expect(this.thing.doers).to.have.lengthOf(1)
                    expect(this.thing.doers).to.have.include(dataStore.doer.id)
                })
            },
            recipientIsNotDoer: () => {
                Then('doer is not a doer anymore', function () {
                    expect(this.thing.doers).to.have.lengthOf(0)
                })
            },
            noSubscribers: () => {
                Then('recipient is not a sucscriber', function () {
                    expect(this.thing.subscribers).to.exist
                    expect(this.thing.subscribers).to.have.lengthOf(0)
                })
            },
            eventCreated: (numOfEvents, eventType, messageText, notificationIndex = -1) => {
                Then(`event ${eventType} is created`, function () {
                    expect(this.thing.events).to.have.lengthOf(numOfEvents)
                    expect(nth(this.thing.events, notificationIndex).eventType).to.equal(eventType)
                    expect(nth(this.thing.events, notificationIndex).payload).to.exist

                    if (!isUndefined(messageText))
                        expect(nth(this.thing.events, notificationIndex).payload.text).to.equal(messageText)
                })
            },
            creatorReceivedNotification: (eventType, notificationIndex = -1) => {
                Then(`creator receives a ${eventType} notification`, function () {
                    expect(nth(this.thing.events, notificationIndex).showNewList).to.have.lengthOf(1)
                    expect(nth(this.thing.events, notificationIndex).showNewList).to.include(dataStore.creator.id)
                })
            },
            doerReceivedNotification: (eventType, notificationIndex = -1) => {
                Then(`recipient receives a ${eventType} notification`, function () {
                    expect(nth(this.thing.events, notificationIndex).showNewList).to.have.lengthOf(1)
                    expect(nth(this.thing.events, notificationIndex).showNewList).to.include(dataStore.doer.id)
                })
            },
            noOneReceivedNotification: (eventType, notificationIndex = -1) => {
                Then(`no one receives the ${eventType} notification`, function () {
                    expect(nth(this.thing.events, notificationIndex).showNewList).to.have.lengthOf(0)
                })
            },
            creatorReadNotification: (eventType, notificationIndex = -1) => {
                Then(`event ${eventType} is marked as read for the creator`, function () {
                    expect(nth(this.thing.events, notificationIndex).payload.readByList).to.have.lengthOf(1)
                    expect(nth(this.thing.events, notificationIndex).payload.readByList).to.include(dataStore.creator.id)
                })
            },
            notificationDiscardedForCreator: (eventType, notificationIndex = -1) => {
                Then(`the ${eventType} notification is discarded for the creator`, function () {
                    expect(nth(this.thing.events, notificationIndex).showNewList).to.not.include(dataStore.creator.id)
                })
            },
            notificationDiscardedForDoer: (eventType, notificationIndex = -1) => {
                Then(`the ${eventType} notification is discarded for the doer`, function () {
                    expect(nth(this.thing.events, notificationIndex).showNewList).to.not.include(dataStore.doer.id)
                })
            },
            userIsMentioned: () => {
                Then('mentioned user appears as mentioned', function () {
                    expect(this.thing.mentioned).to.exist
                    expect(this.thing.mentioned).to.have.lengthOf(1)
                    expect(this.thing.mentioned).to.include(dataStore.mentionedUser.id)
                })
            },
            mentionedUserIsSubscribed: () => {
                Then('mentioned user is subscribed to notifications', function () {
                    expect(this.thing.subscribers).to.exist
                    expect(this.thing.subscribers.length).to.equal(1)
                    expect(this.thing.subscribers[0]).to.equal(dataStore.mentionedUser.id)
                })
            },
            mentionedUserReceivedNotification: notificationIndex => {
                Then('mentioned user receives a notification', function () {
                    expect(this.thing.events[notificationIndex].payload).to.exist
                    expect(this.thing.events[notificationIndex].payload.mentioned).to.have.lengthOf(1)
                    expect(this.thing.events[notificationIndex].payload.mentioned).to.include(dataStore.mentionedUser.id)
                })
            },
            emailIsSent: () => {
                Then('email is sent', function () {
                    expect(mock.EmailMock.sendMessage.calledOnce).to.be.true
                })
            }
        }
    }
}
