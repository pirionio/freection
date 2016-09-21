import process from 'process'

let clientID
let clientSecret
let callbackURL
let token

if (process.env.NODE_ENV === 'production') {
    clientID = process.env.SLACK_CLIENT_ID
    clientSecret = process.env.SLACK_CLIENT_SECRET
    callbackURL = process.env.SLACK_CALLBACK_URL
    token = process.env.SLACK_TOKEN
} else {
    clientID = '48439740646.79575517602'
    clientSecret = '84715a6bcc9a2f577ed2a9d0fb473a49'
    callbackURL = `${process.env.FREECTION_HOST}/api/slack`
    token = 'sNRhszyMNQJHojL7yKcL7nNL'
}

export default { clientID, clientSecret, callbackURL, token }


