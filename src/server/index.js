'use strict'
const express = require('express')
const passport = require('passport')
const path = require('path')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const login = require('./routes/login')
const api = require('./routes/api')
const token = require('./token')
const tokenConfig = require('./config/token')

// Configure express
const app = new express()
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(passport.initialize())
app.use(token.initialize(passport, {secret: tokenConfig.secret}))

// Serve static
app.use(express.static(path.join(__dirname, '../public')))

// Homepage
app.get('/', function (request, response) {
    response.render('index', {
        state: {
            auth: {
                isAuthenticated: request.isAuthenticated()
            }
        }
    })
})

// Routing
app.use('/login', login)
app.use('/api', api)

// Dev only
if (app.get('env') === 'development') {
    const webpack = require('webpack')
    const webpackDevMiddleware = require('webpack-dev-middleware')
    const webpackHotMiddleware = require('webpack-hot-middleware')
    const webpackConfig = require('../../config/webpack.dev.config')
    const compiler = webpack(webpackConfig)
    app.use(webpackDevMiddleware(compiler, {noInfo: true, publicPath: webpackConfig.output.publicPath}))
    app.use(webpackHotMiddleware(compiler))
}

app.set('port', (process.env.PORT || 3000))
app.listen(app.get('port'), function () {
    console.log(`Running in ${app.get('env')} mode on port ${app.get('port')}`)
})


