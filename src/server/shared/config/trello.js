import process from 'process'

let appKey
let appSecret
const callbackURL = `${process.env.FREECTION_HOST}/api/trello/callback`
const webhookURL = `${process.env.FREECTION_HOST}/webhook/trello`

if (process.env.NODE_ENV === 'production') {
    appKey = process.env.TRELLO_APP_KEY
    appSecret = process.env.TRELLO_APP_SECRET
} else {
    appKey = '2b2199aea26b1274d934e305364b9a6e'
    appSecret = '05477fe2694f58eba7ef993746345846e37746aedc3d33d0781a171adf8f256c'
}

export default {appKey, appSecret, callbackURL, webhookURL}



