const ExtractTextPlugin = require('extract-text-webpack-plugin')
const config = require('./webpack.config')

config.plugins = [
    ...config.plugins,
    new ExtractTextPlugin('style.css')]

config.module.loaders = [
    ...config.module.loaders,
    {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        loader:'babel?presets[]=react&presets[]=es2015'
    },
    {
        test: /\.(scss|css)$/,
        loader: ExtractTextPlugin.extract('style', 'css!sass')
    }
]

module.exports = config
