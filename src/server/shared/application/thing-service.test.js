import mockery from 'mockery'

import {given, when, then, setupThingMocks, setupThingService, cleanThingMocks} from '../../../../test/util/thing-given-util'
import ThingStatus from '../../../common/enums/thing-status'
import EventTypes from '../../../common/enums/event-types'

describe.only('Thing Service', function() {
    let ThingDomainMock, UserMock, EventMock, EmailMock

    function setup() {
        mockery.enable({
            warnOnReplace: false,
            warnOnUnregistered: false
        })

        mockery.registerAllowable('./thing-service')

        setupMocks()
        setupThingService()
    }

    function setupMocks() {
        [ThingDomainMock, EventMock, UserMock, EmailMock] = setupThingMocks()

        mockery.registerMock('../domain/thing-domain', ThingDomainMock)

        mockery.registerMock('../models', {
            User: UserMock,
            Event: EventMock
        })

        mockery.registerMock('../technical/email-send-service', EmailMock)
    }

    function clean() {
        mockery.deregisterMock('../domain/thing-domain')
        mockery.deregisterMock('../models')
        mockery.deregisterMock('../technical/email-send-service')
        mockery.deregisterAllowable('./thing-service')

        mockery.disable()
    }

    before(setup)
    after(clean)

    describe('New Thing', function() {
        describe('sent to a single recipient within the organization', function() {
            afterEach(cleanThingMocks)

            given.basic()
            when.newThing('marsellus.wallace@freection.com', 'Hello World')
            then.statusIs(ThingStatus.NEW.key)
            then.creatorIsFollowUpper()
            then.noSubscribers()
            then.eventCreated(1, EventTypes.CREATED.key, 'Hello World')
            then.doerReceivedNotification(EventTypes.CREATED.key, 0)
            then.creatorReadNotification(0)
        })

        describe('mentioning a user', function() {
            afterEach(cleanThingMocks)

            given.basic()
            when.newThing('marsellus.wallace@freection.com', '@mia.wallace FYI')
            then.userIsMentioned()
            then.mentionedUserIsSubscribed()
            then.mentionedUserReceivedNotification(0)
        })
        
        describe('sent to a user outside of the organization', function() {
            afterEach(cleanThingMocks)

            given.basic()
            given.notFreectionUser()
            when.newThing('john.doe@othercompany.com', 'Hello World')
            then.statusIs(ThingStatus.NEW.key)
            then.creatorIsFollowUpper()
            then.emailIsSent()
        })
        
        describe('sent to myself', function() {
            afterEach(cleanThingMocks)

            given.basic()
            given.userIsCreator()
            when.newThing('vincent.vega@freection.com', 'Hello World')
            then.creatorIsDoer()
            then.creatorIsNotFollowUpper()
        })
    })

    describe('Do thing', function() {
        describe('doing a regular Freection-generated thing', function() {
            afterEach(cleanThingMocks)

            given.basic()
            given.thingInNew()
            when.doThing()
            then.statusIs(ThingStatus.INPROGRESS.key)
            then.recipientIsDoer()
            then.eventCreated(2, EventTypes.ACCEPTED.key)
            then.noOneReceivedNotification(EventTypes.ACCEPTED.key)
            then.notificationDiscardedForDoer(EventTypes.CREATED.key, 0)
        })
    })

    describe('Dismiss thing', function() {
        describe('when it is in the to do list', function() {
            afterEach(cleanThingMocks)

            given.basic()
            given.thingInDo()
            when.dismissThing()
            then.statusIs(ThingStatus.DISMISS.key)
            then.recipientIsNotDoer()
            then.creatorIsFollowUpper()
            then.eventCreated(3, EventTypes.DISMISSED.key, 'Dismiss message')
            then.creatorReceivedNotification(EventTypes.DISMISSED.key)
        })

        describe('when it is still in the whats new list', function() {
            afterEach(cleanThingMocks)

            given.basic()
            given.thingInNew()
            when.dismissThing()
            then.statusIs(ThingStatus.DISMISS.key)
            then.recipientIsNotDoer()
            then.creatorIsFollowUpper()
            then.eventCreated(2, EventTypes.DISMISSED.key, 'Dismiss message')
            then.creatorReceivedNotification(EventTypes.DISMISSED.key)
            then.notificationDiscardedForDoer(EventTypes.CREATED.key, 0)
        })
    })
})
