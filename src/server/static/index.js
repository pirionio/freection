const express = require('express')
const path = require('path')

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
        const auth = {
            isAuthenticated: request.isAuthenticated(),
        }

        if (auth.isAuthenticated) {
            auth.id = request.user.id
            auth.firstName = request.user.firstName
            auth.lastName = request.user.lastName
            auth.email = request.user.email
        }

        response.render('index', {
            state: {
                auth
            }
        })
    })
}
