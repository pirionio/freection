const {compact} = require('lodash')

Promise.compact = function(promises) {
    return Promise.all(promises)
        .then(results => compact(results))
}
