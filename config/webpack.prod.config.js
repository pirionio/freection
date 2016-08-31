const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const config = require('./webpack.config')

config.devtool = 'source-map'
config.plugins = [
    ...config.plugins,
    new ExtractTextPlugin('style.css'),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.EnvironmentPlugin(['NODE_ENV'])]

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
    },
    {
        test: /\.(png|jpg|jpeg|gif|svg|woff|woff2)$/,
        loader: 'url-loader',
        query: {
            name: '[hash].[ext]',
            limit: 10000
        }
    }
]

module.exports = config
