const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const AssetPlugin = require('assets-webpack-plugin')
const config = require('./webpack.config')

config.devtool = 'source-map'
config.plugins = [
    ...config.plugins,
    new ExtractTextPlugin('style.[contentHash].css'),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.EnvironmentPlugin(['NODE_ENV']),
    new AssetPlugin({
        fullPath: false,
        path: path.join(__dirname, '../dist/server/static/')
    })]

config.output.filename = '[name].[hash].js'

config.module.loaders = [
    ...config.module.loaders,
    {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        loader:'babel?presets[]=react&presets[]=es2015&presets[]=babel-async-preset'
    },
    {
        test: /\.(css)$/,
        loader: ExtractTextPlugin.extract('style', 'css')
    },
    {
        test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot|ico)$/,
        loader: 'url-loader',
        query: {
            name: '[hash].[ext]',
            limit: 10000
        }
    }
]

module.exports = config
