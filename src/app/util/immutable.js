const {set, unset, get, merge} = require('lodash')

class Immutable {
    constructor(source) {
        this._object = Object.assign({}, source)
    }

    touch(path) {
        const value = Object.assign({}, get(this._object, path))
        set(this._object, path, value)

        return this
    }

    mergeInArray(path, predicate, value) {
        const array = get(this._object, path)

        set(this._object, path, array.map(item => {
            if (predicate(item))
                return merge({}, item, value)
            else
                return item
        }))

        return this
    }

    pushToArray(path, value) {
        const array = get(this._object, path)
        set(this._object, path, [...array, value])

        return this
    }

    value() {
        return this._object
    }
}

function immutable(source) {
    return new Immutable(source)
}

module.exports = immutable
