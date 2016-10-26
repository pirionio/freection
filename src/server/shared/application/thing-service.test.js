import ThingTestUtil from '../../../test/util/thing-test-util'
import DummyDataStore from '../../../test/util/dummy-data-store'
import ThingServiceMock from '../../../test/mocks/thing-service-mock'
import TestConstants from '../../../test/test-constants'
import ThingStatus from '../../../common/enums/thing-status'
import EventTypes from '../../../common/enums/event-types'

describe.only('Thing Service', function() {
    const dataStore = new DummyDataStore()
    const thingServiceMock = new ThingServiceMock(dataStore)
    const thingTestUtil = new ThingTestUtil(thingServiceMock, dataStore)

    after(thingServiceMock.clean)

    describe('New Thing', function() {
        describe('sent to a single recipient within the organization', function() {
            afterEach(thingServiceMock.resetMocks)

            thingTestUtil.given.basic()
            
            thingTestUtil.when.newThing(TestConstants.DOER_EMAIL, 'Hello World')
            
            thingTestUtil.then.statusIs(ThingStatus.NEW.key)
            thingTestUtil.then.creatorIsFollowUpper()
            thingTestUtil.then.noSubscribers()
            thingTestUtil.then.eventCreated(1, EventTypes.CREATED.key, 'Hello World')
            thingTestUtil.then.doerReceivedNotification(EventTypes.CREATED.key, 0)
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
            
            thingTestUtil.then.statusIs(ThingStatus.NEW.key)
            thingTestUtil.then.creatorIsFollowUpper()
            thingTestUtil.then.emailIsSent()
        })

        describe('sent to myself', function() {
            afterEach(thingServiceMock.resetMocks)

            thingTestUtil.given.basic()
            
            thingTestUtil.when.newThing(TestConstants.CREATOR_EMAIL, 'Hello World')
            
            thingTestUtil.then.creatorIsDoer()
            thingTestUtil.then.creatorIsNotFollowUpper()
        })
    })

    describe('Do thing', function() {
        describe('doing a regular Freection-generated thing', function() {
            afterEach(thingServiceMock.resetMocks)

            thingTestUtil.given.basic()
            thingTestUtil.given.thingInNew()
            
            thingTestUtil.when.doThing()
            
            thingTestUtil.then.statusIs(ThingStatus.INPROGRESS.key)
            thingTestUtil.then.recipientIsDoer()
            thingTestUtil.then.eventCreated(2, EventTypes.ACCEPTED.key)
            thingTestUtil.then.noOneReceivedNotification(EventTypes.ACCEPTED.key)
            thingTestUtil.then.notificationDiscardedForDoer(EventTypes.CREATED.key, 0)
        })
    })

    describe('Dismiss thing', function() {
        describe('when it is in the to do list', function() {
            afterEach(thingServiceMock.resetMocks)

            thingTestUtil.given.basic()
            thingTestUtil.given.thingInDo()
            
            thingTestUtil.when.dismissThing()
            
            thingTestUtil.then.statusIs(ThingStatus.DISMISS.key)
            thingTestUtil.then.recipientIsNotDoer()
            thingTestUtil.then.creatorIsFollowUpper()
            thingTestUtil.then.eventCreated(3, EventTypes.DISMISSED.key, 'Dismiss message')
            thingTestUtil.then.creatorReceivedNotification(EventTypes.DISMISSED.key)
        })

        describe('when it is still in the whats new list', function() {
            afterEach(thingServiceMock.resetMocks)

            thingTestUtil.given.basic()
            thingTestUtil.given.thingInNew()
            
            thingTestUtil.when.dismissThing()
            
            thingTestUtil.then.statusIs(ThingStatus.DISMISS.key)
            thingTestUtil.then.recipientIsNotDoer()
            thingTestUtil.then.creatorIsFollowUpper()
            thingTestUtil.then.eventCreated(2, EventTypes.DISMISSED.key, 'Dismiss message')
            thingTestUtil.then.creatorReceivedNotification(EventTypes.DISMISSED.key)
            thingTestUtil.then.notificationDiscardedForDoer(EventTypes.CREATED.key, 0)
        })
    })
})
