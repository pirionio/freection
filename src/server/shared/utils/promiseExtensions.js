import {compact} from 'lodash'

Promise.compact = function(promises) {
    return Promise.all(promises)
        .then(results => compact(results))
}

export default Promise
