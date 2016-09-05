import EmailRoute from './email-route'
import token from '../shared/utils/token-strategy'

export function configure(app) {
    app.use('/emails/api', token.auth())
    app.use('/emails/api', EmailRoute)
}
