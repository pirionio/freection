const path = require('path')

module.exports = {
    devtool: 'inline-source-map',
    context: path.join(__dirname, '/src/app'),
    entry: ['./index.js'],
    output: {
        path: path.join(__dirname, '/src/public'),
        filename: 'bundle.js',
        publicPath: '/'
    },
    module: {
        loaders:[
            {
                test: /\.jsx?$/,
                exclude: /(node_modules)/,
                loaders: [
                    'babel?presets[]=react&presets[]=es2015'
                ]
            }
        ]
    }
}