const process = require('process')

if (process.env.NODE_ENV == 'production') {
    const host = process.env.PPRTRL_HOST
    const port = process.env.PPRTRL_PORT
    const source = process.env.PPRTRL_SOURCE

    module.exports = {
        host,
        port,
        source,
        enable: host && port && source
    }
}
else {
    module.exports = {enable:false}
}