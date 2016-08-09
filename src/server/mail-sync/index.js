const EmailRoute = require('./email-route')
const token = require('../shared/utils/token-strategy')

module.exports = app => {
    app.use('/emailssync/api', token.auth())
    app.use('/emailssync/api', EmailRoute)
}
