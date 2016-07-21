const process = require('process')

if (process.env.NODE_ENV === 'production') {
    module.exports = {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL}
} else {
    module.exports = {
        clientID: '593494787516-jsgh4pc441pcnf63rikc1gqltbbo6l5q.apps.googleusercontent.com',
        clientSecret: 'PoIM9wEtX66QZzJ_SgJ-qjtl',
        callbackURL: 'http://localhost:3000/login/google/callback'
    }
}

