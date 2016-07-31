const github = require('./github')

module.exports = (app) => {
    app.use('/webhook/github', github)
}
