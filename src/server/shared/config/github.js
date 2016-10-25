import process from 'process'

let clientID
let clientSecret
let callbackURL
let webhookURL

if (process.env.NODE_ENV === 'production') {
    clientID = process.env.GITHUB_CLIENT_ID
    clientSecret = process.env.GITHUB_CLIENT_SECRET
    callbackURL = process.env.GITHUB_CALLBACK_URL
    webhookURL = process.env.GITHUB_WEBHOOK_URL
} else {
    clientID = '670e9152744b7c09ad10'
    clientSecret = '8b205abce1b65d869020c0c0aeb878f6faa35f85'
    callbackURL = `${process.env.FREECTION_HOST}/api/github/callback`
    webhookURL = `${process.env.FREECTION_HOST}/webhook/github`
}

export default {clientID, clientSecret, callbackURL, webhookURL}


