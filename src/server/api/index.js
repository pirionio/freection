import api from './routes'

export function configure(app) {
    app.use('/api', api)
}
