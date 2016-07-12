const process = require('process')

if (process.env.NODE_ENV === 'production') {
    module.exports = {secret: 'process.env.TOKEN_SECRET'}
} else {
    module.exports = {
        secret : 'JustSomeRandomText'
    }
}

