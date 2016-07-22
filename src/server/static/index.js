const express = require('express')
const path = require('path')
const jwt = require('jsonwebtoken')

const tokenConfig = require('../shared/config/token')
const logger = require('../shared/utils/logger')
const login = require('./login')

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

    // Serve the main index file for any request that's not handled specifically,
    // to support URL navigation without hash tags.
    app.get('*', function (request, response) {
        fillAuthDetails(request).then(auth => {
            response.render('index', {
                state: {
                    auth
                }
            })
        })
    })
}

function fillAuthDetails(request) {
    return new Promise(resolve => {
        const auth = {
            isAuthenticated: request.isAuthenticated()
        }

        if (!auth.isAuthenticated) {
            return resolve(auth)
        }

        auth.id = request.user.id
        auth.firstName = request.user.firstName
        auth.lastName = request.user.lastName
        auth.email = request.user.email

        var tokenOptions = request.user.exp ? {} : {expiresIn: '30 days'}
        jwt.sign(request.user, tokenConfig.pushSecret, tokenOptions, (error, pushToken) => {
            if (error) {
                logger.error(`Failed to sign user ${request.user.email} for a the push service token`, error)
                return resolve(auth)
            }
            auth.pushToken = pushToken
            resolve(auth)
        })
    })
}
