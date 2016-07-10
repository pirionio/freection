const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
    devtool: 'inline-source-map',
    context: path.join(__dirname, '/src/app'),
    entry: ['./index.js'],
    output: {
        path: path.join(__dirname, '/src/public'),
        filename: 'bundle.js',
        publicPath: '/'
    },
    plugins: [
        new ExtractTextPlugin('style.css', { allChunks: true })
    ],
    module: {
        loaders:[
            {
                test: /\.jsx?$/,
                exclude: /(node_modules)/,
                loaders: [
                    'babel?presets[]=react&presets[]=es2015'
                ]
            },
            {
                test: /\.(scss|css)$/,
                loader: ExtractTextPlugin.extract('css!sass')
            }
        ]
    }
}