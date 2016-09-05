import github from './github'

export function configure(app) {
    app.use('/webhook/github', github)
}
