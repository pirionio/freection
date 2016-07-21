const process = require('process')

const version = '3'

if (process.env.NODE_ENV === 'production') {
    module.exports = {
        secret: 'process.env.HTTP_TOKEN_SECRET' + version,
        pushSecret: 'process.env.PUSH_TOKEN_SECRET' + version
    }
} else {
    module.exports = {
        secret: 'JustSomeRandomText' + version,
        pushSecret: 'AnotherRandomText' + version
    }
}

