const process = require('process')

if (process.env.NODE_ENV === 'production') {
    const webpack = require('webpack')
    const webpackConfig = require('../config/webpack.prod.config')
    console.log('compiling webpack...')
    webpack(webpackConfig, function(err, stats) {
        console.log(stats.toString('errors-only'))
    })
}
