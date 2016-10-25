import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import mockery from 'mockery'
import sinon from 'sinon'
import 'sinon-as-promised'

chai.use(chaiAsPromised)
const expect = chai.expect

describe.only('Thing Service', function() {
    let ThingService, ThingDomainMock, UserMock, EventMock, EmailMock

    function setup() {
        mockery.enable({
            warnOnReplace: false,
            warnOnUnregistered: false
        })

        mockery.registerAllowable('./thing-service')

        setupMocks()

        ThingService = require('./thing-service')
    }

    function initMocks() {
        ThingDomainMock.createThing.returnsArg(0)
        ThingDomainMock.updateThing.returnsArg(0)
        ThingDomainMock.getFullThing.resolves({})
        UserMock.getUserByEmail.resolves(generateDoer())
        UserMock.getUserByUsername.resolves(generateMentionedUser())
        EmailMock.sendMessage.resolves({})
    }

    function setupMocks() {
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

    function cleanMocks() {
        ThingDomainMock.createThing.reset()
        ThingDomainMock.updateThing.reset()
        ThingDomainMock.getFullThing.reset()
        UserMock.getUserByEmail.reset()
        UserMock.getUserByUsername.reset()
        EmailMock.sendMessage.reset()
    }

    function generateCreator() {
        return {
            id: 'ID-vincent',
            username: 'vincent.vega',
            email: 'vincent.vega@freection.com',
            firstName: 'Vincent',
            lastName: 'Vega'
        }
    }

    function generateDoer() {
        return {
            id: 'ID-marsellus',
            username: 'marsellus.wallace',
            email: 'marsellus.wallace@freection.com',
            firstName: 'Marsellus',
            lastName: 'Wallace'
        }
    }

    function generateMentionedUser() {
        return {
            id: 'ID-mia',
            username: 'mia.wallace',
            email: 'mia.wallace@freection.com',
            firstName: 'Mia',
            lastName: 'Wallace'
        }
    }

    function generateThing(creator, status, events) {
        return {
            id: 'Thing-1',
            type: 'THING',
            subject: 'The Subject',
            body: 'The Body',
            creator,
            payload: {
                status
            },
            doers: [],
            followUpers: [],
            mentioned: [],
            subscribers: [],
            all: [],
            events
        }
    }

    function generateCreatedEvent(creator, thingId, showNewList) {
        return {
            id: 'Event-Created-1',
            thingId,
            eventType: 'CREATED',
            creator,
            showNewList
        }
    }

    before(setup)
    after(clean)

    describe('New Thing', function() {
        function newThing(body, to = 'marsellus.wallace@freection.com') {
            const creator = generateCreator()
            return ThingService.newThing(creator, to, 'The Subject', body)
        }

        describe('sent to a single recipient within the organization', function() {
            afterEach(cleanMocks)

            Given(function() {
                initMocks()
            })
            When('thing', function() {
                return newThing('Hello World')
            })
            Then('is in status NEW', function() {
                expect(this.thing.payload).to.exist
                expect(this.thing.payload.status).to.equal('NEW')
            })
            And('creator is a follow upper', function() {
                expect(this.thing.followUpers).to.exist
                expect(this.thing.followUpers.length).to.equal(1)
                expect(this.thing.followUpers[0]).to.equal('ID-vincent')
            })
            And('recipient is not a sucscriber', function() {
                expect(this.thing.subscribers).to.exist
                expect(this.thing.subscribers.length).to.equal(0)
            })
            And('event CREATED is created', function() {
                expect(this.thing.events).to.have.lengthOf(1)
                expect(this.thing.events[0].eventType).to.equal('CREATED')
                expect(this.thing.events[0].payload).to.exist
                expect(this.thing.events[0].payload.text).to.equal('Hello World')
            })
            And('recipient receives a notification', function() {
                expect(this.thing.events[0].showNewList).to.have.lengthOf(1)
                expect(this.thing.events[0].showNewList).to.include('ID-marsellus')
            })
            And('text is marked as read for the creator', function() {
                expect(this.thing.events[0].payload.readByList).to.have.lengthOf(1)
                expect(this.thing.events[0].payload.readByList).to.include('ID-vincent')
            })
        })

        describe('mentioning a user', function() {
            afterEach(cleanMocks)

            Given(function() {
                initMocks()
            })
            When('thing', function() {
                return newThing('@mia.wallace FYI')
            })
            Then('mentioned user appears as mentioned', function() {
                expect(this.thing.mentioned).to.exist
                expect(this.thing.mentioned.length).to.equal(1)
                expect(this.thing.mentioned[0]).to.equal('ID-mia')
            })
            And('mentioned user is subscribed to notifications', function() {
                expect(this.thing.subscribers).to.exist
                expect(this.thing.subscribers.length).to.equal(1)
                expect(this.thing.subscribers[0]).to.equal('ID-mia')
            })
            And('mentioned user receives a notification', function() {
                expect(this.thing.events[0].payload).to.exist
                expect(this.thing.events[0].payload.mentioned).to.have.lengthOf(1)
                expect(this.thing.events[0].payload.mentioned).to.include('ID-mia')
            })
        })

        describe('sent to a user outside of the organization', function() {
            afterEach(cleanMocks)

            Given(function() {
                initMocks()
            })
            And(function() {
                UserMock.getUserByEmail.returns(Promise.reject('NotFound'))
            })
            When('thing', function() {
                return newThing('Hello World', 'john.doe@othercompany.com')
            })
            Then('is in status NEW', function() {
                expect(this.thing.payload).to.exist
                expect(this.thing.payload.status).to.equal('NEW')
            })
            And('creator is a follow upper', function() {
                expect(this.thing.followUpers).to.exist
                expect(this.thing.followUpers.length).to.equal(1)
                expect(this.thing.followUpers[0]).to.equal('ID-vincent')
            })
            And('email is sent', function() {
                expect(EmailMock.sendMessage.calledOnce).to.be.true
            })
        })

        describe('sent to myself', function() {
            afterEach(cleanMocks)

            Given(function() {
                initMocks()
            })
            And(function() {
                UserMock.getUserByEmail.resolves(generateCreator())
            })
            When('thing', function() {
                return newThing('Hello World', 'vincent.vega@othercompany.com')
            })
            Then('creator is a doer', function() {
                expect(this.thing.doers).to.have.lengthOf(1)
                expect(this.thing.doers).to.include('ID-vincent')
            })
            Then('creator is not a follow upper', function() {
                expect(this.thing.followUpers).to.have.lengthOf(0)
            })
        })
    })

    describe('Do thing', function() {
        function doThing() {
            const user = generateDoer()
            return ThingService.doThing(user, '111')
        }

        describe('doing a regular Freection-generated thing', function() {
            afterEach(cleanMocks)

            Given(function() {
                initMocks()
            })
            And(function() {
                ThingDomainMock.getFullThing.resolves(generateThing(generateCreator(), 'NEW', [
                    generateCreatedEvent(generateCreator(), 'Thing-1', ['ID-marsellus'])
                ]))
            })
            When('thing', function() {
                return doThing()
            })
            Then('is in status IN PROGRESS', function() {
                expect(this.thing.payload).to.exist
                expect(this.thing.payload.status).to.equal('INPROGRESS')
            })
            And('recipient is a doer', function() {
                expect(this.thing.doers).to.have.lengthOf(1)
                expect(this.thing.doers).to.have.include('ID-marsellus')
            })
            And('event ACCEPTED is created', function() {
                expect(this.thing.events).to.have.lengthOf(2)
                expect(this.thing.events[1].eventType).to.equal('ACCEPTED')
            })
            And('no one receives the ACCEPTED event', function() {
                expect(this.thing.events[1].showNewList).to.have.lengthOf(0)
            })
            And('the CREATED event is discarded for the doer', function() {
                expect(this.thing.events[0].showNewList).to.not.include('ID-marsellus')
            })
        })
    })
})
