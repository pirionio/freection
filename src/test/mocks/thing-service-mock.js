import sinon from 'sinon'
import 'sinon-as-promised'
import mockery from 'mockery'
import classAutobind from 'class-autobind'

import TestConstants from '../test-constants'

export default class ThingServiceMock {
    constructor(dataStore) {
        classAutobind(this, ThingServiceMock.prototype)

        this._dataStore = dataStore

        this._prepareMocks()
        this._prepareMockery()
        this._prepareService()
    }

    _prepareMocks() {
        this.ThingDomainMock = {
            createThing: sinon.stub(),
            updateThing: sinon.stub(),
            getFullThing: sinon.stub()
        }
        this.EventMock = {
        }
        this.UserMock = {
            getUserByEmail: sinon.stub(),
            getUserByUsername: sinon.stub()
        }
        this.EmailMock = {
            sendMessage: sinon.stub()
        }
    }

    _prepareMockery() {
        mockery.enable({
            warnOnReplace: false,
            warnOnUnregistered: false
        })

        mockery.registerAllowable('./thing-service')

        mockery.registerMock('../domain/thing-domain', this.ThingDomainMock)
        mockery.registerMock('../models', {
            User: this.UserMock,
            Event: this.EventMock
        })
        mockery.registerMock('../technical/email-send-service', this.EmailMock)
    }

    _prepareService() {
        this.ThingService = require('../../server/shared/application/thing-service')
    }

    clean() {
        this.resetMocks()

        mockery.deregisterMock('../domain/thing-domain')
        mockery.deregisterMock('../models')
        mockery.deregisterMock('../technical/email-send-service')
        mockery.deregisterAllowable('./thing-service')

        mockery.disable()
    }

    initMocks() {
        this.ThingDomainMock.createThing.returnsArg(0)
        this.ThingDomainMock.updateThing.returnsArg(0)
        this.ThingDomainMock.getFullThing.resolves({})

        this.UserMock.getUserByEmail.returns(Promise.reject('NotFound'))
        this.UserMock.getUserByEmail.withArgs(TestConstants.CREATOR_EMAIL).returns(Promise.resolve(this._dataStore.creator))
        this.UserMock.getUserByEmail.withArgs(TestConstants.DOER_EMAIL).returns(Promise.resolve(this._dataStore.doer))

        this.UserMock.getUserByUsername.returns(Promise.reject('NotFound'))
        this.UserMock.getUserByUsername.withArgs(TestConstants.MENTIONED_USER_USERNAME).returns(Promise.resolve(this._dataStore.mentionedUser))

        this.EmailMock.sendMessage.resolves({})
    }

    resetMocks() {
        this.ThingDomainMock.createThing.reset()
        this.ThingDomainMock.updateThing.reset()
        this.ThingDomainMock.getFullThing.reset()
        this.UserMock.getUserByEmail.reset()
        this.UserMock.getUserByUsername.reset()
        this.EmailMock.sendMessage.reset()
    }
}