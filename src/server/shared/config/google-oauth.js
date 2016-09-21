import process from 'process'

let clientID
let clientSecret
let callbackURL

if (process.env.NODE_ENV === 'production') {
    clientID = process.env.GOOGLE_CLIENT_ID
    clientSecret = process.env.GOOGLE_CLIENT_SECRET
    callbackURL = process.env.GOOGLE_CALLBACK_URL
} else {
    clientID = '593494787516-jsgh4pc441pcnf63rikc1gqltbbo6l5q.apps.googleusercontent.com'
    clientSecret = 'PoIM9wEtX66QZzJ_SgJ-qjtl'
    callbackURL = `${process.env.FREECTION_HOST}/login/google/callback`
}

export default {clientID, clientSecret, callbackURL}

