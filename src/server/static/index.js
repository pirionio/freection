const express = require('express')
const path = require('path')
const jwt = require('jsonwebtoken')

import {isDemo} from '../shared/config/demo'

import tokenConfig from '../shared/config/token'
import logger from '../shared/utils/logger'
const login = require('./login')

const reducer = require('../../app/reducers')
const WhatsNewActions = require('../../app/actions/whats-new-actions')
const ToDoActions = require('../../app/actions/to-do-actions')
const FollowUpActions = require('../../app/actions/follow-up-actions')
const AuthActions = require('../../app/actions/auth-actions')
const ContactsActions = require('../../app/actions/contacts-actions')
import * as ThingService from '../shared/application/thing-service'
import * as ContactService from '../shared/application/contact-service'

module.exports = (app) => {
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'ejs')

    // Serve static
    app.use(express.static(path.join(__dirname, '../../public')))

    app.use('/login', login)

    // Dev only
    if (app.get('env') === 'development') {
        const webpack = require('webpack')
        const webpackDevMiddleware = require('webpack-dev-middleware')
        const webpackHotMiddleware = require('webpack-hot-middleware')
        const webpackConfig = require('../../../config/webpack.dev.config')
        const compiler = webpack(webpackConfig)
        app.use(webpackDevMiddleware(compiler, {noInfo: true, publicPath: webpackConfig.output.publicPath}))
        app.use(webpackHotMiddleware(compiler))
    }

    app.get('/demo', function(request, response) {
        if (isDemo)
            response.render('demo')
    })

    // Serve the main index file for any request that's not handled specifically,
    // to support URL navigation without hash tags.
    app.get('*', function (request, response) {
        getInitialState(request)
            .then(state => response.render('index', { state }))
            .catch(error => {
                logger.error('error while trying to serve index', error)
                response.status(500).send('Error while trying to get the file')
            })
    })
}

async function getInitialState(request) {
    const {user} = request
    let state = {}

    if (request.isAuthenticated()) {
        const whatsNew = await ThingService.getWhatsNew(user)
        state = reducer(state, WhatsNewActions.setState(whatsNew))

        const todo = await ThingService.getToDo(user)
        state = reducer(state, ToDoActions.setState(todo))

        const followUps = await ThingService.getFollowUps(user)
        state = reducer(state, FollowUpActions.setState(followUps))

        const contacts = await ContactService.get(user)
        state = reducer(state, ContactsActions.setState(contacts))
    }

    const authState = await getAuthState(request)
    state = reducer(state, AuthActions.setState(authState))
    state = Object.assign(state, {
        config: getConfig()
    })

    return state
}

async function getAuthState(request) {
    const auth = {
        isAuthenticated: request.isAuthenticated()
    }

    if (!auth.isAuthenticated) {
        return auth
    }

    auth.id = request.user.id
    auth.firstName = request.user.firstName
    auth.lastName = request.user.lastName
    auth.email = request.user.email

    var tokenOptions = request.user.exp ? {} : {expiresIn: '30 days'}
    try {
        // TODO: this is synchronous function call, we might want to call async version of it
        auth.pushToken = jwt.sign(request.user, tokenConfig.pushSecret, tokenOptions)
        return auth
    } catch (error) {
        logger.error(`Failed to sign user ${request.user.email} for a the push service token`, error)
        return auth
    }
}

function getConfig() {
    return {
        isDemo: isDemo
    }
}