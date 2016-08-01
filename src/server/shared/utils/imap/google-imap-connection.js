const ImapConnection = require('./imap-connection')

class GoogleImapConnection extends ImapConnection {
    constructor(accessToken, username) {
        const char1 = String.fromCharCode(1)
        const xoauth2 = `user=${username}${char1}auth=Bearer ${accessToken}${char1}${char1}`

        super('google', {
            host: 'imap.gmail.com',
            port: 993,
            tls: true,
            xoauth2: new Buffer(xoauth2).toString('base64')
        })
    }
}

module.exports = GoogleImapConnection