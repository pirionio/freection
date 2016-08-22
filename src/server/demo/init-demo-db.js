const process = require('process')
const {User, Thing, Event} = require('../shared/models')
const ThingService = require('../shared/application/thing-service')

const userId = '1a66ffbe-114f-4f21-bf4b-126c518be17c'
const subject = 'Moving from equinix to AWS or Azure'
const subject2 = 'Find alternative to broadcast for feed'

async function sendThing(from, to, subject, body, accept = false) {
    const fromUser = (await User.filter({firstName: from}).run())[0]
    const toUser = (await User.filter({firstName: to}).run())[0]

    const thingId = await ThingService.newThing(fromUser, toUser.email, subject, body)

    if (accept) {
        await ThingService.doThing(toUser, thingId)
    }
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
            username: 'doron.somech',
            organization: 'leverate.com',
            firstName: 'Doron',
            lastName: 'Somech',
            refreshToken,
            accessToken
        },
        {
            createdAt: new Date(),
            googleId: '1',
            email: 'kobi.gur.leverate@gmail.com',
            username: 'kobi.gur',
            organization: 'leverate.com',
            firstName: 'Kobi',
            lastName: 'Gur',
            accessToken: '123',
            refreshToken: '456'
        },
        {
            createdAt: new Date(),
            googleId: '1',
            email: 'eitan.baron.leverate@gmail.com',
            username: 'eitan.baron',
            organization: 'leverate.com',
            firstName: 'Eitan',
            lastName: 'Baron',
            accessToken: '123',
            refreshToken: '456'
        },
        {
            createdAt: new Date(),
            googleId: '1',
            email: 'or.chubook.leverate@gmail.com',
            username: 'or.chubook',
            organization: 'leverate.com',
            firstName: 'Or',
            lastName: 'Chubook',
            accessToken: '123',
            refreshToken: '456'
        },
        {
            createdAt: new Date(),
            googleId: '1',
            email: 'itai.damti.leverate@gmail.com',
            username: 'itai.damti',
            organization: 'leverate.com',
            firstName: 'Itai',
            lastName: 'Damti',
            accessToken: '123',
            refreshToken: '456'
        },
        {
            createdAt: new Date(),
            googleId: '1',
            email: 'ronen.barak.leverate@gmail.com',
            username: 'ronen.barak',
            organization: 'leverate.com',
            firstName: 'Ronen',
            lastName: 'Barak',
            accessToken: '123',
            refreshToken: '456'
        },
        {
            createdAt: new Date(),
            googleId: '1',
            email: 'josef.kaplan.leverate@gmail.com',
            username: 'josef.kaplan',
            organization: 'leverate.com',
            firstName: 'Josef',
            lastName: 'Kaplan',
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

    try {
        await User.filter(doc => doc('id').ne(userId)).delete().execute()
        await Thing.delete().execute()
        await Event.delete().execute()
        await createUsers(user)
        await sendThing('Kobi', 'Doron', subject, 'Hi Doron,\r\n\r\nWe are paying a lot of money to equinix, please make a plan to move to AWS.', true)
        await sendThing('Doron', 'Ronen', subject2, 'Hi Ronen,\r\n\r\nAs we are looking into moving from equinix to AWS or azure where broadcast is not available we need to look into an alternative.\r\nplease find one, take a look at NetMQ', true)
        await sendThing('Eitan', 'Doron', 'IPhone old prices bug', 'Hi Doron,\r\n\r\nAs you probably know we have a bug on production where IPhone traders trade on old prices, this is very urgent. \r\nPlease find a fix ASAP')
    }
    catch(error) {
        console.log(error)
    }

    console.log('generated')
}

module.exports.subject = subject
module.exports.subject2 = subject2
