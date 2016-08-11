const webpack = require('webpack')
const config = require('./webpack.config')

config.devtool = 'cheap-eval-source-map'
config.entry = [
    'webpack-hot-middleware/client',
    ...config.entry]
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
            'babel?presets[]=react&presets[]=es2015'
        ]
    },
    {
        test: /\.(scss|css)$/,
        loader: 'style!css!sass'
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
