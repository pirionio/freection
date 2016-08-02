const EmailRoute = require('./email-route')

module.exports = app => {
    // TODO Add auth
    app.use('/emails/api', EmailRoute)
}
