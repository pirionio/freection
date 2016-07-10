const webpack = require('webpack')
const path = require('path')

module.exports = {
    devtool: 'inline-source-map',
    context: path.join(__dirname, '/src/app'),
    entry: [
        'webpack-hot-middleware/client',
        './index.js'],
    output: {
        path: path.join(__dirname, '/src/public'),
        filename: 'bundle.js',
        publicPath: '/'
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ],
    module: {
        loaders:[
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
            }
        ]
    }
}