const webpack = require('webpack')
const path = require('path')

module.exports = {
    context: path.join(__dirname, '../src/app'),
    entry: [
        './index.js'
    ],
    output: {
        path: path.join(__dirname, '../src/public'),
        filename: 'bundle.js',
        publicPath: '/'
    },
    plugins: [new webpack.EnvironmentPlugin(['NODE_ENV'])],
    module: {
        loaders:[] // Loaders are configured in prod/dev files
    }
}