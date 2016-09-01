'use strict'
import express from 'express'
import http from 'http'
import passport from 'passport'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import token from './utils/token-strategy'
import tokenConfig from './config/token'
import logger from './utils/logger'

// Configure express
const app = new express()

app.server = http.createServer(app)

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(passport.initialize())
app.use(token.initialize(passport, {secret: tokenConfig.secret}))

app.start = () => {
    app.set('port', (process.env.PORT || 3000))
    app.server.listen(app.get('port'), function () {
        logger.info(`Running in ${app.get('env')} mode on port ${app.get('port')}`)
    })
}

export default app
