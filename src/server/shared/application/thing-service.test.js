import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import mockery from 'mockery'
import sinon from 'sinon'
import 'sinon-as-promised'

chai.use(chaiAsPromised)
const expect = chai.expect

describe('Thing Service', function() {
    let ThingService, ThingMock, UserMock, EventMock, EmailMock

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
        ThingMock.save.returnsArg(0)
        ThingMock.saveAll.returnsArg(0)
        ThingMock.getFullThing.resolves({})
        EventMock.save.returnsArg(0)
        UserMock.getUserByEmail.resolves(generateDoer())
        UserMock.getUserByUsername.resolves(generateMentionedUser())
        EmailMock.sendMessage.resolves({})
    }

    function setupMocks() {
        ThingMock = {
            save: sinon.stub(),
            saveAll: sinon.stub(),
            getFullThing: sinon.stub()
        }
        EventMock = {
            save: sinon.stub()
        }
        UserMock = {
            getUserByEmail: sinon.stub(),
            getUserByUsername: sinon.stub()
        }
        EmailMock = {
            sendMessage: sinon.stub()
        }

        mockery.registerMock('../models', {
            Thing: ThingMock,
            User: UserMock,
            Event: EventMock
        })

        mockery.registerMock('../technical/email-send-service', EmailMock)
    }

    function clean() {
        mockery.deregisterMock('../models')
        mockery.deregisterMock('../technical/email-send-service')
        mockery.deregisterAllowable('./thing-service')

        mockery.disable()
    }

    function cleanMocks() {
        ThingMock.save.reset()
        ThingMock.saveAll.reset()
        ThingMock.getFullThing.reset()
        EventMock.save.reset()
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
        const thing = {
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
            events,
            save: sinon.stub()
        }

        thing.save.resolves({})

        return thing
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
                const event = EventMock.save.getCall(0).returnValue
                expect(event.eventType).to.equal('CREATED')
                expect(event.payload).to.exist
                expect(event.payload.text).to.equal('Hello World')
            })
            And('recipient receives a notification', function() {
                const event = EventMock.save.getCall(0).returnValue
                expect(event.showNewList).to.have.lengthOf(1)
                expect(event.showNewList).to.include('ID-marsellus')
            })
            And('text is marked as read for the creator', function() {
                const event = EventMock.save.getCall(0).returnValue
                expect(event.payload.readByList).to.have.lengthOf(1)
                expect(event.payload.readByList).to.include('ID-vincent')
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
                const event = EventMock.save.getCall(0).returnValue
                expect(event.payload).to.exist
                expect(event.payload.mentioned).to.have.lengthOf(1)
                expect(event.payload.mentioned).to.include('ID-mia')
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
    })

    describe.only('Do thing', function() {
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
                ThingMock.getFullThing.resolves(generateThing(generateCreator(), 'NEW', [
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
