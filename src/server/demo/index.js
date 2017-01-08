import * as ThingService from '../shared/application/thing-service'
import {User, Thing} from '../shared/models'
import initDemoDB, {userId} from './init-demo-db'
import logger from '../shared/utils/logger'
import token from '../shared/utils/token-strategy'
import {createUserToken} from '../shared/utils/token-creator'

async function done() {
    const fromUser = (await User.filter({firstName: 'Jawed'}).run())[0]
    const thing = (await Thing.filter({subject: 'Supporting Internet Explorer 4'}).run())[0]

    await ThingService.markAsDone(fromUser, thing.id, {text: 'This IE really sucks man...'})
}

async function ping() {
    const fromUser = (await User.filter({firstName: 'Peter'}).run())[0]
    const thing = (await Thing.filter({subject: 'Supporting American Express'}).run())[0]

    await ThingService.ping(fromUser, thing.id)
}

async function getUserToken() {
    const user = await User.get(userId).run()

    return createUserToken(user)
}

export function configure(app) {
    app.post('/demo/init', (request, response) => {
    initDemoDB(request.query.withScenario)
        .then(() => {
            logger.info('complete initialize db for demo')
            response.redirect('/demo')
        })
        .catch(error => {
            logger.error('error while initialize db for demo', error)
            response.status(500).send(error)
        })
    })

    app.post('/demo/ping', (request, response) => {
        ping()
            .then(() => response.redirect('/demo'))
            .catch(error => response.status(500).send(error))

    })

    app.post('/demo/done', (request, response) => {
        done()
            .then(() => response.redirect('/demo'))
            .catch(error => response.status(500).send(error))

    })

    app.post('/demo/login', (request, response, next) => {

        getUserToken()
            .then(user => {
                token.login({ user, redirect: '/', expiresIn: '1000 days' })(request, response, next)
            })
    })
}
