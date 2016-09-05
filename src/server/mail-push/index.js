import EmailRoute from './email-route'
import token from '../shared/utils/token-strategy'

export function configure(app) {
    app.use('/emails/push', token.auth())
    app.use('/emails/push', EmailRoute)
}
