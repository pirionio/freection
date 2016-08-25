const process = require('process')
const {User, Thing, Event} = require('../shared/models')
const ThingService = require('../shared/application/thing-service')
const EventService = require('../shared/application/event-service')
const EventTypes = require('../../common/enums/event-types')
const {SharedConstants} = require('../../common/shared-constants')

const userId = '1a66ffbe-114f-4f21-bf4b-126c518be17c'

async function sendThing(from, to, subject, body) {
    const fromUser = (await User.filter({firstName: from}).run())[0]
    const toUser = (await User.filter({firstName: to}).run())[0]

    return await ThingService.newThing(fromUser, toUser.email, subject, body)
}

async function acceptThing(firstName, thingId) {
    const user = (await User.filter({firstName: firstName}).run())[0]
    await ThingService.doThing(user, thingId)
}

async function comment(from, thingId, text) {
    const fromUser = (await User.filter({firstName: from}).run())[0]

    await ThingService.comment(fromUser, thingId, text)
}


async function ping(firstName, thingId) {
    const user = (await User.filter({firstName: firstName}).run())[0]
    await ThingService.ping(user, thingId)
}

async function discardComments(firstName, thingId) {
    const user = (await User.filter({firstName: firstName}).run())[0]

    await ThingService.discardEventsByType(user, thingId, EventTypes.COMMENT.key)
}

async function readAllComments(firstName, thingId) {
    const user = (await User.filter({firstName: firstName}).run())[0]
    const thing = await ThingService.getThing(user, thingId)

    await Promise.all(thing.events.filter(event => {
        return SharedConstants.MESSAGE_TYPED_EVENTS.includes(event.eventType.key) &&
            (!event.payload.readByList || !event.payload.readByList.includes(user.id))
    }).map(event => EventService.markAsRead(user, event.id)))
}

async function createUsers(user) {
    // finding the access token and refresh token if exist
    const refreshToken = user ? user.refreshToken : null
    let accessToken = user ? user.accessToken : null

    const users = [{
            id: userId,
            createdAt: new Date(),
            googleId: '101686250757425128601',
            email: 'doron.somech.leverate@gmail.com',
            username: 'max.levchin',
            organization: 'paypal.com',
            firstName: 'Max',
            lastName: 'Levchin',
            refreshToken,
            accessToken
        },
        {
            createdAt: new Date(),
            googleId: '1',
            email: 'peter.thiel.freection@gmail.com',
            username: 'peter.thiel',
            organization: 'paypal.com',
            firstName: 'Peter',
            lastName: 'Thiel',
            accessToken: '123',
            refreshToken: '456'
        },
        {
            createdAt: new Date(),
            googleId: '1',
            email: 'elon.musk.freection@gmail.com',
            username: 'elon.musk',
            organization: 'paypal.com',
            firstName: 'Elon',
            lastName: 'Musk',
            accessToken: '123',
            refreshToken: '456'
        },
        {
            createdAt: new Date(),
            googleId: '1',
            email: 'steve.chen.freection@gmail.com',
            username: 'steve.chen',
            organization: 'paypal.com',
            firstName: 'Steve',
            lastName: 'Chen',
            accessToken: '123',
            refreshToken: '456'
        },
        {
            createdAt: new Date(),
            googleId: '1',
            email: 'david.sacks.freection@gmail.com',
            username: 'David.Sacks',
            organization: 'paypal.com',
            firstName: 'David',
            lastName: 'Sacks',
            accessToken: '123',
            refreshToken: '456'
        },
        {
            createdAt: new Date(),
            googleId: '1',
            email: 'jawed.karim.freection@gmail.com',
            username: 'Jawed.Karim',
            organization: 'paypal.com',
            firstName: 'Jawed',
            lastName: 'Karim',
            accessToken: '123',
            refreshToken: '456'
        }
    ]

    await User.save(users, {conflict: 'update'})
}

module.exports = async function() {
    let user

    try {
        user = await User.get(userId).run()
    } catch (error) {
    }

    await User.filter(doc => doc('id').ne(userId)).delete().execute()
    await Thing.delete().execute()
    await Event.delete().execute()
    await createUsers(user)

    // American express
    const americanExpress = await sendThing('Peter', 'Max', 'Supporting American Express', 'Hi Max, \r\n\r\nIt’s growing urgent to support these, guys at the field say our churn might be related.\r\nLet’s see what it takes on engineering side.')
    await acceptThing('Max', americanExpress)
    await comment('Max', americanExpress, 'Okay, do we know how many users really bounce because of this?')
    await comment('Peter', americanExpress, 'Not really sure about the figures, Premal has a thing open for it. Does it matter? :)')
    await comment('Max', americanExpress, 'Hehe no, just interesting to understand how crucial it is.')
    await discardComments('Max', americanExpress)
    await readAllComments('Max', americanExpress)

    // microsoft
    const microsoft = await sendThing('Elon', 'Max', 'Change all technologies to Microsoft', 'Go')
    await acceptThing('Max', microsoft)
    await comment('Max', microsoft, 'Huh?')
    await comment('Elon', microsoft, 'This linux shit breaks all the time, we put so much effort only on compiling kernel fixes all the time, we really need to move to Microsoft.')
    await comment('Max', microsoft, 'Well, what about ‘please’…?')
    await comment('Elon', microsoft, 'Please shut the fuck up and do it.')
    await comment('Max', microsoft, 'It`s gonna cost you')
    await discardComments('Max', microsoft)
    await readAllComments('Max', microsoft)

    // Widget for ebay
    const widget = await sendThing('Max', 'Steve', 'Widget for eBay', 'So this is the general spec of the feature from Premal. It’s not totally baked, go over it and see what’s missing and what we can complete on our own.')
    await acceptThing('Steve', widget)
    await comment('Steve', widget, 'Cool, I’ll go over it')
    await ping('Max', widget)
    await comment('Steve', widget, 'Sorry, was all over the crash thing\r\nAnyway, I think we can start implementing some of the basic UI stuff, but there are many open questions regarding the API.')
    await comment('Max', widget, 'Let’s begin with short iterations to get the feeling for Permal.')
    await discardComments('Max', widget)
    await readAllComments('Max', widget)
    await comment('Steve', widget, 'Cool, do we have documentation of the eBay API somewhere?')

    // Supporting IE4
    const ie4 = await sendThing('Max', 'Jawed', 'Supporting Internet Explorer 4', 'Seems like a pretty big portion of our users actually still use this old browser, we really need it to work properly and to look at least… acceptable.')
    await acceptThing('Jawed', ie4)
    await comment('Jawed', ie4, ' Oh man just checked how it looks on IE 4, damn…')
    await comment('Max', ie4, ':)')
    await discardComments('Max', ie4)
    await readAllComments('Max', ie4)
    //await done('Jawed', ie4, 'This IE really sucks man...')

    // interview
    await sendThing('Max', 'Steve', 'What do you think about that girl you interviewed yesterday?', 'I have a following interview with her next week, would be glad to go over your remarks')

    // What's new
    await sendThing('David', 'Max', 'Crash from last night', 'Hey Max\r\n\r\n, not sure if you got it, but many users could not log in tonight, can we direct them that it’s all over now?\r\nPlease keep me in the loop and let me know ASAP.')
    await sendThing('Steve', 'Max', 'let\'s talk about my salary', 'Hey what’s up?\r\n\r\nI’ve been in the company for a while now, I would appreciate it if we could have a talk about upgrading my salary.\r\n\r\nThank you!')
    await sendThing('Peter', 'Max', 'How many active users so far this month', 'I have a meeting soon, can’t remember the exact number we talked about last week in the meeting.')
}