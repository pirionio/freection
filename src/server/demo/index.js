import * as ThingService from '../shared/application/thing-service'
import {User, Thing} from '../shared/models'
import initDemoDB from './init-demo-db'
import logger from '../shared/utils/logger'

async function done() {
    const fromUser = (await User.filter({firstName: 'Jawed'}).run())[0]
    const thing = (await Thing.filter({subject: 'Supporting Internet Explorer 4'}).run())[0]

    await ThingService.markAsDone(fromUser, thing.id, 'This IE really sucks man...')
}

export function configure(app) {
    app.post('/demo/init', (request, response) => {
        initDemoDB()
            .then(() => {
                logger.info('complete initialize db for demo')
                response.redirect('/demo')
            })
            .catch(error => {
                logger.error('error while initialize db for demo', error)
                response.status(500).send(error)
            })
    })

    app.post('/demo/done', (request, response) => {
        done()
            .then(() => response.redirect('/demo'))
            .catch(error => response.status(500).send(error))

    })
}
