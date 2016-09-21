import github from './github'
import slack from './slack'

export function configure(app) {
    app.use('/webhook/github', github)
    app.use('/webhook/slack', slack)
}
