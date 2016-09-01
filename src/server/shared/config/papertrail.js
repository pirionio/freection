import process from 'process'

let config

if (process.env.NODE_ENV === 'production') {
    const host = process.env.PPRTRL_HOST
    const port = process.env.PPRTRL_PORT
    const source = process.env.PPRTRL_SOURCE

    config = {
        enable: host && port && source,
        host,
        port,
        source
    }
}
else {
    config = {enable: false}
}

export default config