const process = require('process')

if (process.env.NODE_ENV == 'production') {
    const host = process.env.PPRTRL_HOST
    const port = process.env.PPRTRL_PORT

    module.exports = {
        host,
        port,
        enable: host && port
    }
}
else {
    module.exports = {enable:false}
}