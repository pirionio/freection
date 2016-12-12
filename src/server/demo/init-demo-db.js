import {find, random} from 'lodash'

import * as ThingService from '../shared/application/thing-service'
import * as EventService from '../shared/application/event-service'
import * as EmailService from '../shared/application/email-service'
import * as UserService from '../shared/application/users-service'
import {User, Thing, Event} from '../shared/models'
import SharedConstants from '../../common/shared-constants'
import ThingSource from '../../common/enums/thing-source'
import TodoTimeCategory from '../../common/enums/todo-time-category'

export const userId = '2cf26b7e-e3a7-41d9-b476-5ad25f59bde1'
let freectionUsers = []
let externalUsers = []

async function getUser(user) {
    if (find(freectionUsers, {firstName: user}))
        return (await User.filter({firstName: user}).run())[0]

    return find(externalUsers, {id: user})
}

async function sendThing(from, to, subject, body, payload) {
    const fromUser = await getUser(from)
    const toUser = await getUser(to)
    return await ThingService.newThing(fromUser, toUser.email, {subject, text: body}, payload)
}

async function sendEmailThing(creator, recipientEmail, subject, payload) {
    const fromUser = await getUser(creator)
    const recipient = await getUser(recipientEmail)
    return await EmailService.newEmailThing(fromUser, {subject, recipients: [recipient], threadId: random(1, Number.MAX_VALUE).toString()}, false, payload)
}

async function acceptThing(firstName, thing) {
    const user = (await User.filter({firstName: firstName}).run())[0]
    await ThingService.doThing(user, thing.id)
}

async function comment(from, thing, text) {
    const fromUser = (await User.filter({firstName: from}).run())[0]

    await ThingService.comment(fromUser, thing.id, {text})
}

async function addCommentFromEmail(from, thing, commentMessage) {
    await ThingService.addCommentFromEmail(thing.id, random(1, Number.MAX_VALUE).toString(), from, new Date(), commentMessage)
}

async function ping(firstName, thing) {
    const user = (await User.filter({firstName: firstName}).run())[0]
    await ThingService.ping(user, thing.id)
}

async function discardComments(firstName, thing) {
    const user = (await User.filter({firstName: firstName}).run())[0]

    await ThingService.discardComments(user, thing.id)
}

async function readAllComments(firstName, thing) {
    const user = (await User.filter({firstName: firstName}).run())[0]
    const fullThing = await ThingService.getThing(user, thing.id)

    await Promise.all(fullThing.events.filter(event => {
        return SharedConstants.MESSAGE_TYPED_EVENTS.includes(event.eventType.key) &&
            (!event.payload.readByList || !event.payload.readByList.includes(user.id))
    }).map(event => EventService.markAsRead(user, event.id)))
}

async function createUsers() {
    freectionUsers = [
        {
            id: userId,
            createdAt: new Date(),
            googleId: '113674947832787766592',
            email: 'max.freection@gmail.com',
            username: 'max.levchin',
            organization: 'paypal.com',
            firstName: 'Max',
            lastName: 'Levchin',
        },
        {
            id: 'e4cc822f-bc8b-4839-8237-c25f10a1db29',
            createdAt: new Date(),
            googleId: '111506101202178845879',
            email: 'david.freection@gmail.com',
            username: 'david.sacks',
            organization: 'paypal.com',
            firstName: 'David',
            lastName: 'Sacks'
        },
        {
            id: '066c2cc8-32ad-4919-a943-d8ccc3c0db58',
            createdAt: new Date(),
            googleId: '107855123843159852359',
            email: 'peter.freection@gmail.com',
            username: 'peter.thiel',
            organization: 'paypal.com',
            firstName: 'Peter',
            lastName: 'Thiel'
        },
        {
            id: '322ac797-4086-4396-a203-2e5d1d05a0b6',
            createdAt: new Date(),
            googleId: '1',
            email: 'elon.freection@gmail.com',
            username: 'elon.musk',
            organization: 'paypal.com',
            firstName: 'Elon',
            lastName: 'Musk'
        },
        {
            id: '5f9a8dcb-3ad8-40e6-9966-f92c9135b74f',
            createdAt: new Date(),
            googleId: '116406706736007077224',
            email: 'steve.freection@gmail.com',
            username: 'steve.chen',
            organization: 'paypal.com',
            firstName: 'Steve',
            lastName: 'Chen'
        },
        {
            id: '79889b8f-f5f7-42af-b102-e01e60b3a393',
            createdAt: new Date(),
            googleId: '2',
            email: 'jawed.freection@gmail.com',
            username: 'jawed.karim',
            organization: 'paypal.com',
            firstName: 'Jawed',
            lastName: 'Karim'
        }
    ]

    externalUsers = [
        {
            id: 'hardy@seqouoia.com',
            email: '"Hardy" <hardy@seqouoia.com>',
            name: 'Hardy'
        },
        {
            id: 'eden.freection@gmail.com',
            email: '"Eden Yang" <eden.freection@gmail.com>',
            name: 'Eden Yang'
        }
    ]

    await User.save(freectionUsers, {conflict: 'update'})
}

export default async function() {
    await User.filter(doc => doc('id').ne(userId)).delete().execute()
    await Thing.delete().execute()
    await Event.delete().execute()
    await createUsers()

    // Tasks in to-do

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

    // monthly report
    const monthlyReport = await sendEmailThing('Max', 'eden.freection@gmail.com', 'Monthly report')

    // article from slack
    const article = await sendThing('Max', 'Max', 'Read that article Elon sent', 'https://techcrunch.com/2016/12/07/slack-and-google-announce-partnership-focused-on-better-integrating-their-services/', {source: ThingSource.SLACK.key})

    // guest payments
    const guestPayments = await sendThing('Jawed', 'Max', 'Did we add support for guests payment?', null, {source: ThingSource.SLACK.key})
    await acceptThing('Max', guestPayments)

    // add question professional interviews
    const addQuestions = await sendThing('Max', 'Max', 'Add new question about styling for professional interviews', 'Many candidates seem to be strong with new web concepts, but really lack design and style knowledge. We better cover this in interviews.', {source: ThingSource.ASANA.key})

    // legalities
    const legalities = await sendEmailThing('Max', 'hardy@seqouoia.com', 'Close legalities', {isUrgent: true})

    // user profile design
    const userProfileDesign = await sendThing('Steve', 'Max', 'User profile design review', 'This is the initial version [google doc link]', {source: ThingSource.ASANA.key})
    await acceptThing('Max', userProfileDesign)
    await comment('Max', userProfileDesign, 'Didn’t we say it would be a link from the org page?')
    await comment('Steve', userProfileDesign, 'Well, remember that the goal is to increase the assurance of the user in your system, and it is mainly by being able to watch your relationship with other users. The organization thing will come, but only afterwards.')
    await comment('Max', userProfileDesign, 'Okay, I’ll go over it.')
    await discardComments('Max', userProfileDesign)
    await readAllComments('Max', userProfileDesign)

    // CR manifesto
    const crManifesto = await sendThing('David', 'Max', 'Manifesto for code reviews', 'Come up with a clear guide about how and when to do them.', {source: ThingSource.ASANA.key})
    await acceptThing('Max', crManifesto)

    // Update user to-do groups.
    await UserService.setTodos(userId, {
        [TodoTimeCategory.NEXT.key]: [guestPayments.id, addQuestions.id],
        [TodoTimeCategory.LATER.key]: [monthlyReport.id, userProfileDesign.id, americanExpress.id],
        [TodoTimeCategory.SOMEDAY.key]: [article.id, crManifesto.id, microsoft.id]
    })

    // Tasks in follow-up

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

    // 10bis
    const tenbis = await sendThing('Max', 'eden.freection@gmail.com', 'New 10bis card', 'Hey Eden, how are you?\r\n\r\nSeems like my card is not working :/\r\n\r\nCan we issue me a new one?\r\n\r\nThanks!')
    await addCommentFromEmail('eden.freection@gmail.com', tenbis, 'Hey Max,\r\n\r\nWhat do you mean by “not working”?\r\n\r\nLet me check into it.')
    await discardComments('Max', tenbis)
    await readAllComments('Max', tenbis)

    // QA involvement
    const qaInvolvement = await sendThing('Max', 'David', 'QS involvement', 'So as people mentioned in the introspection, we need to involve QA better.')
    await acceptThing('David', qaInvolvement)
    await comment('David', qaInvolvement, 'Yeah, maybe we can sit with them earlier when features (or bugs) arrive to our team.')
    await comment('David', qaInvolvement, 'Oh, and we can try the project we talked about earlier as pilot.')
    await comment('Max', qaInvolvement, 'Yes, maybe someone from your team can be involved in designing automatic tests.\r\n\r\nIn any case, I will schedule with Dana to figure this out.')
    await discardComments('Max', qaInvolvement)
    await readAllComments('Max', qaInvolvement)

    await sendThing('Max', 'Steve', 'Knowledge base for support', 'I saw that when I worked with David - every day when the on-duty changes, many things seem to slip.', {source: ThingSource.ASANA.key})

    const videos = await sendThing('Max', 'Jawed', 'Can we uploads videos for education about our product?', null, {source: ThingSource.SLACK.key})
    await acceptThing('Jawed', videos)

    // New tasks in Inbox

    await sendThing('David', 'Max', 'Crash from last night', 'Hey Max,\r\n\r\nnot sure if you got it, but many users could not log in tonight, can we direct them that it’s all over now?\r\nPlease keep me in the loop and let me know ASAP.')
    await sendThing('Steve', 'Max', 'let\'s talk about my salary', 'Hey what’s up?\r\n\r\nI’ve been in the company for a while now, I would appreciate it if we could have a talk about upgrading my salary.\r\n\r\nThank you!')
    await sendThing('Peter', 'Max', 'How many active users so far this month', 'I have a meeting soon, can’t remember the exact number we talked about last week in the meeting.')

    /* const peter = await User.get('066c2cc8-32ad-4919-a943-d8ccc3c0db58').run()
     await EmailService.sendEmail(peter, 'max.freection@gmail.com', 'Company Update',
         'Hi all,\r\n\r\n' +
         'To begin with, this was a very encouraging week!\r\n\r\n' +
         'The stagnation we had with the revenues had finally stopped and we see the increase we’d been wishing for.\r\n' +
         'We can also safely say that it’s not just random - we see a strong correlation between our sales efforts and this increase.\r\n' +
         'So keep up the good work!\r\n\r\n'+
         'Some more notes:\r\n' +
         '* We had a peak of made transactions last Friday! :)\r\n' +
         '* Next month are holidays, third week of December to to first week of January, we’re on vacation.\r\n' +
         '* Say hello to Jenny Smith, our new employee at the support team.\r\n\r\nRegards, \r\n\r\nPeter')

     const david = await User.get(davidUserId).run()
     await EmailService.sendEmail(david, 'max.freection@gmail.com', 'Monthly Report', 'Attached hereby is the monthly report.\r\n' +
         'A few remarks:\r\n'+
         '* There is a problem with the pricing for Amazon, they claim to have been overcharged. We need to look into this ASAP. Max - please take care of this ASAP.\r\n'+
         '* We had a very peculiar peak before the Friday one, do we know if it’s real or something went wrong somewhere?\r\n'+
         '* We need to start thinking about the strategy for 2000 Q1 - Peter set up a meeting?\r\n\r\bRegards,\r\n\r\nDavid')

     const steve = await User.get('5f9a8dcb-3ad8-40e6-9966-f92c9135b74f').run()
     await EmailService.sendEmail(steve, 'max.freection@gmail.com', 'Ordering from Giraffe at 12:01!', 'All welcomed!')*/
}