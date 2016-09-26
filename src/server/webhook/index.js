import github from './github'
import slack from './slack'
import email from './email'

export function configure(app) {
    app.use('/webhook/github', github)
    app.use('/webhook/slack', slack)
    app.use('/webhook/email', email)
}
