const EmailRoute = require('./email-route')
import token from '../shared/utils/token-strategy'

module.exports = app => {
    app.use('/emails/push', token.auth())
    app.use('/emails/push', EmailRoute)
}
