const SmtpConnection = require('./smtp-connection')

class GoogleSmtpConnection extends SmtpConnection {
    constructor(user, accessToken) {
        super(user, {
            service: 'gmail',
            accessToken
        })
    }
}

module.exports = GoogleSmtpConnection