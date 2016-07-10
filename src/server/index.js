'use strict'
const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const api = require('./routes/api')

const app = new express()
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, '../public')))
app.use('/api', api)

// Dev only
if (app.get('env') === 'development') {
    const webpack = require('webpack')
    const webpackDevMiddleware = require('webpack-dev-middleware')
    const webpackHotMiddleware = require('webpack-hot-middleware')
    const webpackConfig = require('../../webpack.config')
    const compiler = webpack(webpackConfig)
    app.use(webpackDevMiddleware(compiler, {noInfo: true, publicPath: webpackConfig.output.publicPath}))
    app.use(webpackHotMiddleware(compiler))
}

app.set('port', (process.env.PORT || 3000))
app.listen(app.get('port'), function () {
    console.log(`Running in ${app.get('env')} mode on port ${app.get('port')}`)
})


