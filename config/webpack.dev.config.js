const webpack = require('webpack')
const config = require('./webpack.config')

config.devtool = 'eval-source-map'
config.entry = Object.assign(config.entry, {
    'bundle': ['webpack-hot-middleware/client?reload=true', './app/index.js'],
    'chrome': ['webpack-hot-middleware/client?reload=true', './extension/src/content.js']
})
config.plugins = [
    ...config.plugins,
    new webpack.HotModuleReplacementPlugin()]
config.module.loaders = [
    ...config.module.loaders,
    {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        loaders: [
            'react-hot',
            'babel?presets[]=react&presets[]=es2015&presets[]=babel-async-preset'
        ]
    },
    {
        test: /\.(css)$/,
        loader: 'style!css'
    },
    {
        test: /\.(png|jpg|jpeg|gif|svg|woff|woff2)$/,
        loader: 'url-loader',
        query: {
            name: '[path][name].[ext]?[hash]'
        }
    }
]

module.exports = config
