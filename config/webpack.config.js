const path = require('path')

module.exports = {
    context: path.join(__dirname, '../src'),
    entry: {
        'bundle': './app/index.js',
        'chrome': './extension/src/content.js'
    },
    output: {
        path: path.join(__dirname, '../dist/public'),
        filename: '[name].js',
        publicPath: '/'
    },
    plugins: [],
    module: {
        loaders:[ // Loaders are configured in prod/dev files
            {
                // Needed for the sanitize-html module which loads JSONs
                test: /\.json$/,
                loader: 'json'
            }
        ]
    },
    node: {
        fs: 'empty'
    }
}