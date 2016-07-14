const process = require('process')

const version = '2'

if (process.env.NODE_ENV === 'production') {
    module.exports = {secret: 'process.env.TOKEN_SECRET' + version}
} else {
    module.exports = {
        secret : 'JustSomeRandomText' + version
    }
}

