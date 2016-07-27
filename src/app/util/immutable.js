const clone = require('lodash/clone')
const set = require('lodash/set')
const get = require('lodash/get')
const reject = require('lodash/reject')
const some = require('lodash/some')
const merge = require('lodash/merge')
const isFunction = require('lodash/isFunction')
const isMatch = require('lodash/isMatch')

class Immutable {
    constructor(source) {
        this._object = clone(source)
    }

    touch(path) {
        const value = clone(get(this._object, path))
        set(this._object, path, value)

        return this
    }

    set(path, value) {
        set(this._object, path, value)

        return this
    }

    arrayReject(path, predicate) {
        const array = get(this._object, path)
        set(this._object, path, reject(array, predicate))

        return this
    }

    arrayMergeItem(path, predicate, updater) {
        const array = get(this._object, path)

        if (array) {
            set(this._object, path, arraySetOrMergeItem(array, predicate, updater, true))
        }

        return this
    }

    arrayPushItem(path, value) {
        const array = get(this._object, path)

        if (array) {
            set(this._object, path, [...array, value])
        }

        return this
    }

    arraySetItem(path, predicate, updater) {
        const array = get(this._object, path)

        if (array) {
            set(this._object, path, arraySetOrMergeItem(array, predicate, updater, false))
        }

        return this
    }
    
    arraySetOrPushItem(path, predicate, value) {
        const array = get(this._object, path)

        if (array) {
            if (some(array, predicate))
                set(this._object, path, arraySetOrMergeItem(array, predicate, value, false))
            else
                set(this._object, path, [...array, value])
        }

        return this
    }

    arraySetAll(path, updater) {
        const array = get(this._object, path)
        
        if (array) {
            set(this._object, path, arraySetOrMergeItem(array, () => true, updater, false))
        }
        
        return this
    }

    value() {
        return this._object
    }
}

function arraySetOrMergeItem(array, predicate, updater, isMerge) {
    return array.map(item => {
        if (matchItem(item, predicate)) {
            const value = getItemValue(item, updater)
            return isMerge ? merge({}, item, value) : value
        } else {
            return item
        }
    })
}

function getItemValue(item, updater) {
    return isFunction(updater) ? updater(item) : updater
}

function matchItem(item, predicate) {
    if (isFunction(predicate)) {
        return predicate(item)
    }

    return isMatch(item, predicate)
}

function immutable(source) {
    return new Immutable(source)
}

module.exports = immutable
