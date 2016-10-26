import ThingTestUtil from '../../../test/util/thing-test-util'
import DummyDataStore from '../../../test/util/dummy-data-store'
import ThingServiceMock from '../../../test/mocks/thing-service-mock'
import TestConstants from '../../../test/test-constants'
import ThingStatus from '../../../common/enums/thing-status'
import EventTypes from '../../../common/enums/event-types'

describe('Thing Service', function() {
    const dataStore = new DummyDataStore()
    const thingServiceMock = new ThingServiceMock(dataStore)
    const thingTestUtil = new ThingTestUtil(thingServiceMock, dataStore)

    after(thingServiceMock.clean)

    describe('New Thing', function() {
        describe('sent to a single recipient within the organization', function() {
            afterEach(thingServiceMock.resetMocks)

            thingTestUtil.given.basic()
            
            thingTestUtil.when.newThing(TestConstants.DOER_EMAIL, 'Hello World')
            
            thingTestUtil.then.statusIs(ThingStatus.NEW)
            thingTestUtil.then.creatorIsFollowUpper()
            thingTestUtil.then.noSubscribers()
            thingTestUtil.then.eventCreated(1, EventTypes.CREATED, 'Hello World')
            thingTestUtil.then.doerReceivedNotification(EventTypes.CREATED, 0)
            thingTestUtil.then.creatorReadNotification(0)
        })

        describe('mentioning a user', function() {
            afterEach(thingServiceMock.resetMocks)

            thingTestUtil.given.basic()
            
            thingTestUtil.when.newThing(TestConstants.DOER_EMAIL, `@${TestConstants.MENTIONED_USER_USERNAME} FYI`)
            
            thingTestUtil.then.userIsMentioned()
            thingTestUtil.then.mentionedUserIsSubscribed()
            thingTestUtil.then.mentionedUserReceivedNotification(0)
        })

        describe('sent to a user outside of the organization', function() {
            afterEach(thingServiceMock.resetMocks)

            thingTestUtil.given.basic()
            
            thingTestUtil.when.newThing(TestConstants.EXTERNAL_USER_EMAIL, 'Hello World')
            
            thingTestUtil.then.statusIs(ThingStatus.NEW)
            thingTestUtil.then.creatorIsFollowUpper()
            thingTestUtil.then.emailIsSent()
        })

        describe('sent to myself', function() {
            afterEach(thingServiceMock.resetMocks)

            thingTestUtil.given.basic()
            
            thingTestUtil.when.newThing(TestConstants.CREATOR_EMAIL, 'Hello World')
            
            thingTestUtil.then.creatorIsDoer()
            thingTestUtil.then.creatorIsNotFollowUpper()
            thingTestUtil.then.notificationDiscardedForCreator(EventTypes.CREATED, 0)
        })
    })

    describe('Do thing', function() {
        describe('doing a regular Freection-generated thing', function() {
            afterEach(thingServiceMock.resetMocks)

            thingTestUtil.given.basic()
            thingTestUtil.given.thingInNew()
            
            thingTestUtil.when.doThing()
            
            thingTestUtil.then.statusIs(ThingStatus.INPROGRESS)
            thingTestUtil.then.recipientIsDoer()
            thingTestUtil.then.eventCreated(2, EventTypes.ACCEPTED)
            thingTestUtil.then.noOneReceivedNotification(EventTypes.ACCEPTED)
            thingTestUtil.then.notificationDiscardedForDoer(EventTypes.CREATED, 0)
        })
    })

    describe('Mark thing as done', function() {
        describe('when it is in the to do list', function() {
            afterEach(thingServiceMock.resetMocks)

            thingTestUtil.given.basic()
            thingTestUtil.given.thingInDo()

            thingTestUtil.when.markThingAsDone()

            thingTestUtil.then.statusIs(ThingStatus.DONE)
            thingTestUtil.then.recipientIsNotDoer()
            thingTestUtil.then.eventCreated(3, EventTypes.DONE, 'Done message')
            thingTestUtil.then.creatorReceivedNotification(EventTypes.DONE)
        })

        describe('when it is in the whats new list', function() {
            afterEach(thingServiceMock.resetMocks)

            thingTestUtil.given.basic()
            thingTestUtil.given.thingInNew()

            thingTestUtil.when.markThingAsDone()

            thingTestUtil.then.statusIs(ThingStatus.DONE)
            thingTestUtil.then.recipientIsNotDoer()
            thingTestUtil.then.eventCreated(2, EventTypes.DONE, 'Done message')
            thingTestUtil.then.creatorReceivedNotification(EventTypes.DONE)
            thingTestUtil.then.notificationDiscardedForDoer(EventTypes.CREATED, 0)
        })

        describe('after it is reopened', function() {
            afterEach(thingServiceMock.resetMocks)

            thingTestUtil.given.basic()
            thingTestUtil.given.thingInReopened()

            thingTestUtil.when.markThingAsDone()

            thingTestUtil.then.statusIs(ThingStatus.DONE)
            thingTestUtil.then.recipientIsNotDoer()
            thingTestUtil.then.eventCreated(4, EventTypes.DONE, 'Done message')
            thingTestUtil.then.creatorReceivedNotification(EventTypes.DONE)
            thingTestUtil.then.notificationDiscardedForDoer(EventTypes.SENT_BACK, 2)
        })
    })
    
    describe('Dismiss thing', function() {
        describe('when it is in the to do list', function() {
            afterEach(thingServiceMock.resetMocks)

            thingTestUtil.given.basic()
            thingTestUtil.given.thingInDo()
            
            thingTestUtil.when.dismissThing()
            
            thingTestUtil.then.statusIs(ThingStatus.DISMISS)
            thingTestUtil.then.recipientIsNotDoer()
            thingTestUtil.then.creatorIsFollowUpper()
            thingTestUtil.then.eventCreated(3, EventTypes.DISMISSED, 'Dismiss message')
            thingTestUtil.then.creatorReceivedNotification(EventTypes.DISMISSED)
        })

        describe('when it is still in the whats new list', function() {
            afterEach(thingServiceMock.resetMocks)

            thingTestUtil.given.basic()
            thingTestUtil.given.thingInNew()
            
            thingTestUtil.when.dismissThing()
            
            thingTestUtil.then.statusIs(ThingStatus.DISMISS)
            thingTestUtil.then.recipientIsNotDoer()
            thingTestUtil.then.creatorIsFollowUpper()
            thingTestUtil.then.eventCreated(2, EventTypes.DISMISSED, 'Dismiss message')
            thingTestUtil.then.creatorReceivedNotification(EventTypes.DISMISSED)
            thingTestUtil.then.notificationDiscardedForDoer(EventTypes.CREATED, 0)
        })
    })
    
    describe('Close thing', function() {
        describe('when it is in the to do list', function() {
            afterEach(thingServiceMock.resetMocks)

            thingTestUtil.given.basic()
            thingTestUtil.given.thingInDo()

            thingTestUtil.when.closeThing()

            thingTestUtil.then.statusIs(ThingStatus.CLOSE)
            thingTestUtil.then.creatorIsNotFollowUpper()
            thingTestUtil.then.recipientIsDoer()
            thingTestUtil.then.eventCreated(3, EventTypes.CLOSED, 'Close message')
            thingTestUtil.then.doerReceivedNotification(EventTypes.CLOSED)
            thingTestUtil.then.creatorReadNotification(EventTypes.CLOSED)
        })

        describe('when it is in the whats new list', function() {
            afterEach(thingServiceMock.resetMocks)

            thingTestUtil.given.basic()
            thingTestUtil.given.thingInNew()

            thingTestUtil.when.closeThing()

            thingTestUtil.then.statusIs(ThingStatus.CLOSE)
            thingTestUtil.then.creatorIsNotFollowUpper()
            thingTestUtil.then.eventCreated(2, EventTypes.CLOSED, 'Close message')
            thingTestUtil.then.doerReceivedNotification(EventTypes.CLOSED)
            thingTestUtil.then.creatorReadNotification(EventTypes.CLOSED)
            thingTestUtil.then.notificationDiscardedForDoer(EventTypes.CREATED, 0)
        })

        describe('after it is reopened', function() {
            afterEach(thingServiceMock.resetMocks)

            thingTestUtil.given.basic()
            thingTestUtil.given.thingInReopened()

            thingTestUtil.when.closeThing()

            thingTestUtil.then.statusIs(ThingStatus.CLOSE)
            thingTestUtil.then.creatorIsNotFollowUpper()
            thingTestUtil.then.eventCreated(4, EventTypes.CLOSED, 'Close message')
            thingTestUtil.then.doerReceivedNotification(EventTypes.CLOSED)
            thingTestUtil.then.creatorReadNotification(EventTypes.CLOSED)
            thingTestUtil.then.notificationDiscardedForDoer(EventTypes.SENT_BACK, 2)
        })

        describe('when it is in done', function() {
            afterEach(thingServiceMock.resetMocks)

            thingTestUtil.given.basic()
            thingTestUtil.given.thingInDone()

            thingTestUtil.when.closeThing()

            thingTestUtil.then.statusIs(ThingStatus.CLOSE)
            thingTestUtil.then.creatorIsNotFollowUpper()
            thingTestUtil.then.eventCreated(4, EventTypes.CLOSED, 'Close message')
            thingTestUtil.then.notificationDiscardedForCreator(EventTypes.DONE, 2)
            thingTestUtil.then.notificationDiscardedForDoer(EventTypes.CLOSED)
        })

        describe('when it is in dismiss', function() {
            afterEach(thingServiceMock.resetMocks)

            thingTestUtil.given.basic()
            thingTestUtil.given.thingInDismissed()

            thingTestUtil.when.closeThing()

            thingTestUtil.then.statusIs(ThingStatus.CLOSE)
            thingTestUtil.then.creatorIsNotFollowUpper()
            thingTestUtil.then.eventCreated(4, EventTypes.CLOSED, 'Close message')
            thingTestUtil.then.notificationDiscardedForCreator(EventTypes.DISMISSED, 2)
            thingTestUtil.then.notificationDiscardedForDoer(EventTypes.CLOSED)
        })
    })
    
    describe('Send thing back', function() {
        describe('when it is in done', function() {
            afterEach(thingServiceMock.resetMocks)

            thingTestUtil.given.basic()
            thingTestUtil.given.thingInDone()

            thingTestUtil.when.sendThingBack()

            thingTestUtil.then.statusIs(ThingStatus.REOPENED)
            thingTestUtil.then.creatorIsFollowUpper()
            thingTestUtil.then.eventCreated(4, EventTypes.SENT_BACK, 'Send back message')
            thingTestUtil.then.doerReceivedNotification(EventTypes.SENT_BACK)
            thingTestUtil.then.notificationDiscardedForDoer(EventTypes.DONE, 2)
        })

        describe('when it is in dismiss', function() {
            afterEach(thingServiceMock.resetMocks)

            thingTestUtil.given.basic()
            thingTestUtil.given.thingInDismissed()

            thingTestUtil.when.sendThingBack()

            thingTestUtil.then.statusIs(ThingStatus.REOPENED)
            thingTestUtil.then.creatorIsFollowUpper()
            thingTestUtil.then.eventCreated(4, EventTypes.SENT_BACK, 'Send back message')
            thingTestUtil.then.doerReceivedNotification(EventTypes.SENT_BACK)
            thingTestUtil.then.notificationDiscardedForDoer(EventTypes.DISMISSED, 2)
        })
    })

    describe('Ping thing', function() {
        describe('when it is in progress', function() {
            afterEach(thingServiceMock.resetMocks)

            thingTestUtil.given.basic()
            thingTestUtil.given.thingInDo()

            thingTestUtil.when.pingThing()

            thingTestUtil.then.statusIs(ThingStatus.INPROGRESS)
            thingTestUtil.then.eventCreated(3, EventTypes.PING)
            thingTestUtil.then.doerReceivedNotification(EventTypes.PING)
            thingTestUtil.then.creatorReadNotification(EventTypes.PING)
        })
    })

    describe('Pong thing', function() {
        describe('when it is in progress', function() {
            afterEach(thingServiceMock.resetMocks)

            thingTestUtil.given.basic()
            thingTestUtil.given.thingPinged()

            thingTestUtil.when.pongThing('Pong text')

            thingTestUtil.then.statusIs(ThingStatus.INPROGRESS)
            thingTestUtil.then.eventCreated(4, EventTypes.PONG)
            thingTestUtil.then.creatorReceivedNotification(EventTypes.PONG)
            thingTestUtil.then.doerReadNotification(EventTypes.PONG)
        })
    })
})
