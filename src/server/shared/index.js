import http from 'http'

import express from 'express'
import passport from 'passport'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import device from 'express-device'
import {Strategy as GoogleStrategy} from 'passport-google-oauth20'

import token from './utils/token-strategy'
import {authenticateGoogle} from './technical/google-service'
import tokenConfig from './config/token'
import googleConfig from './config/google-oauth'
import logger from './utils/logger'

// Configure express
const app = new express()

app.server = http.createServer(app)

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(passport.initialize())
app.use(token.initialize(passport, {secret: tokenConfig.secret}))
app.use(device.capture())

passport.use(new GoogleStrategy({
    clientID: googleConfig.clientID,
    clientSecret: googleConfig.clientSecret
}, authenticateGoogle))

app.start = () => {
    app.set('port', (process.env.PORT || 3000))
    app.server.listen(app.get('port'), () => {
        logger.info(`Running in ${app.get('env')} mode on port ${app.get('port')}`)
    })
}

export default app
