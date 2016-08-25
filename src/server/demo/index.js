const initDemoDB = require('./init-demo-db')
const {User, Thing, Event} = require('../shared/models')
const ThingService = require('../shared/application/thing-service')

async function done() {
    const fromUser = (await User.filter({firstName: 'Jawed'}).run())[0]
    const thing = (await Thing.filter({subject: 'Supporting Internet Explorer 4'}).run())[0]

    await ThingService.markAsDone(fromUser, thing.id, 'This IE really sucks man...')
}


module.exports = (app) => {
    app.get('/demo/init', function(request, response) {
        initDemoDB()
            .then(() => response.redirect('/'))
            .catch(error => response.status(500).send(error))
    })

    app.get('/demo/done', function(request, response) {
        done()
            .then(() => response.redirect('/'))
            .catch(error => response.status(500).send(error))

    })
}
