import process from 'process'

let appKey
let appSecret
const callbackURL = `${process.env.FREECTION_HOST}/api/trello/callback`
const webhookURL = `${process.env.FREECTION_HOST}/webhook/trello`

if (process.env.NODE_ENV === 'production') {
    appKey = process.env.TRELLO_APP_KEY
    appSecret = process.env.TRELLO_APP_SECRET
} else {
    appKey = '5802a3b968c6ecc32b27de648b1943e6'
    appSecret = '93131665a99f497d1e97f42e04c22d011a8fce09e7609df9f704d8431e3ae1b8'
}

export default {appKey, appSecret, callbackURL, webhookURL}



