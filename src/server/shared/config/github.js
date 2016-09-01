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
    clientID = 'fe93a66bc0e3c42ba053'
    clientSecret = 'ce239add720ddbfbf5d7505e1035ba85e06e4f5a'
    callbackURL = 'http://localhost:3000/api/github/callback'
    webhookURL = 'https://c6b551b2.ngrok.io/webhook/github'
}

export default {clientID, clientSecret, callbackURL, webhookURL}


