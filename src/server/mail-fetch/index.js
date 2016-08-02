const EmailRoute = require('./email-route')
const token = require('../shared/utils/token-strategy')

module.exports = app => {
    app.use('/emails/api', token.auth())
    app.use('/emails/api', EmailRoute)
}
