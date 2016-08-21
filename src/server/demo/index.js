const initDemoDB = require('./init-demo-db')
const ThingServie = require('../shared/application/thing-service')

const {User, Thing, Event} = require('../shared/models')

async function ping() {
    const thingId = (await Thing.filter({subject: initDemoDB.subject}).run())[0].id
    const user = (await User.filter({firstName: 'Kobi'}).run())[0]

    await ThingServie.ping(user, thingId)
}

async function done() {
    const thingId = (await Thing.filter({subject: initDemoDB.subject2}).run())[0].id
    const user = (await User.filter({firstName: 'Ronen'}).run())[0]

    await ThingServie.markAsDone(user, thingId, 'I replaced the broadcast with NetMQ pubsub, working great!')
}

module.exports = (app) => {
    app.get('/demo/init', function(request, response) {
        initDemoDB()
        response.send('OK - Init')
    })

    app.get('/demo/ping', function(request, response) {
        ping()
        response.send('OK - Ping')
    })

    app.get('/demo/done', function(request, response) {
        done()
        response.send('OK - Done')
    })
}
