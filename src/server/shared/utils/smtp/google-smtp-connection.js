import SmtpConnection from './smtp-connection'

export default class GoogleSmtpConnection extends SmtpConnection {
    constructor(user, accessToken) {
        super(user, {
            service: 'gmail',
            accessToken
        })
    }
}