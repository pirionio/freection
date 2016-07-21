'use strict'
const express = require('express')
const http = require('http')
const passport = require('passport')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const token = require('./utils/token-strategy')
const tokenConfig = require('./config/token')
const logger = require('./utils/logger')

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

module.exports = app
