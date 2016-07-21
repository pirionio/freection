const api = require('./routes')

module.exports = (app) => {
    app.use('/api', api)
}
