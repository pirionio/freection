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