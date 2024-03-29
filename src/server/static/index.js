import path from 'path'

import express from 'express'
import jwt from 'jsonwebtoken'

import {isDemo} from '../shared/config/demo'
import {isAnalyticsEnabled} from '../shared/config/analytics.js'
import GeneralConfig from '../shared/config/general'
import TokenConfig from '../shared/config/token'
import logger from '../shared/utils/logger'
import login from './login'
import * as ThingService from '../shared/application/thing-service'
import * as UsersService from '../shared/application/users-service.js'
import reducer from '../../app/reducers'
import * as WhatsNewActions from '../../app/actions/whats-new-actions'
import * as ToDoActions from '../../app/actions/to-do-actions'
import * as FollowUpActions from '../../app/actions/follow-up-actions'
import * as AuthActions from '../../app/actions/auth-actions'
import * as UserProfileActions from '../../app/actions/user-profile-actions'
import * as UsersActions from '../../app/actions/users-actions.js'

export function configure(app) {
    app.set('views', path.join(__dirname, 'views'))
    app.set('view engine', 'ejs')

    app.use('/login', login)

    const assets = require('./webpack-assets.json')

    // For the chrome extension we want to make sure we serve the file even if hashes is used
    if (assets.chrome.js !== 'chrome.js') {
        app.get('/chrome.js', (request, response) => {
            response.redirect(302, `/${assets.chrome.js}`)
        })
    }

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

    // Serve static
    app.use(express.static(path.join(__dirname, '../../public')))

    app.get('/thankyou', (request, response) => {
        response.render('thank-you')
    })

    app.get('/demo', (request, response) => {
        if (isDemo)
            response.render('demo')
    })

    app.get('/mobile', (request, response) => {
        const authState = getAuthState(request)
        const state = reducer({}, AuthActions.setState(authState))

        response.render('mobile', {state, assets, isAnalyticsEnabled})
    })

    // Serve the main index file for any request that's not handled specifically,
    // to support URL navigation without hash tags.
    app.get('*', (request, response) => {
        getInitialState(request)
            .then(state => response.render('index', { state, assets, isAnalyticsEnabled }))
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
        const userProfile = await UsersService.getUserProfile(user.id)
        state = reducer(state, UserProfileActions.setState(userProfile))

        const whatsNew = await ThingService.getWhatsNew(user)
        state = reducer(state, WhatsNewActions.setState(whatsNew))

        const todo = await ThingService.getToDo(user)
        state = reducer(state, ToDoActions.setState(todo))

        const followUps = await ThingService.getFollowUps(user)
        state = reducer(state, FollowUpActions.setState(followUps))

        const users = await UsersService.getUsers(user)
        state = reducer(state, UsersActions.setState(users))
    }

    const authState = getAuthState(request)
    state = reducer(state, AuthActions.setState(authState))

    state = Object.assign(state, {
        config: getConfig()
    })

    return state
}

function getAuthState(request) {
    const auth = {
        isAuthenticated: request.isAuthenticated()
    }

    if (!auth.isAuthenticated) {
        return auth
    }

    auth.id = request.user.id

    const tokenOptions = request.user.exp ? {} : {expiresIn: '30 days'}
    try {
        // TODO: this is synchronous function call, we might want to call async version of it
        auth.pushToken = jwt.sign(request.user, TokenConfig.pushSecret, tokenOptions)
        return auth
    } catch (error) {
        logger.error(`Failed to sign user ${request.user.email} for a the push service token`, error)
        return auth
    }
}

function getConfig() {
    return {
        isDemo: isDemo,
        baseUrl: GeneralConfig.BASE_URL
    }
}