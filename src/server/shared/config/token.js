import process from 'process'

const version = '5'

let config

if (process.env.NODE_ENV === 'production') {
    config = {
        secret: `process.env.HTTP_TOKEN_SECRET${version}`,
        pushSecret: `process.env.PUSH_TOKEN_SECRET${version}`
    }
} else {
    config = {
        secret: `JustSomeRandomText${version}`,
        pushSecret: `AnotherRandomText${version}`
    }
}

export default config

