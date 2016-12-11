import process from 'process'

let clientID
let clientSecret
const callbackURL = `${process.env.FREECTION_HOST}/api/asana/callback`
const webhookURL = `${process.env.FREECTION_HOST}/webhook/asana`

if (process.env.NODE_ENV === 'production') {
    clientID = process.env.ASANA_CLIENT_ID
    clientSecret = process.env.ASANA_CLIENT_SECRET
} else {
    clientID = '222642980646441'
    clientSecret = 'ae6b8f3dc018d3b06d90ff64a0220a2f'
}

export default { clientID, clientSecret, callbackURL, webhookURL }



