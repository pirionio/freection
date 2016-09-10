import clone from 'lodash/clone'
import set from 'lodash/set'
import get from 'lodash/get'
import reject from 'lodash/reject'
import some from 'lodash/some'
import merge from 'lodash/merge'
import isFunction from 'lodash/isFunction'
import isMatch from 'lodash/isMatch'

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
    
    merge(path, value) {
        const existingValue = get(this._object, path)
        set(this._object, path, merge(clone(existingValue), value))
        
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
        }

        return item
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

export default function immutable(source) {
    return new Immutable(source)
}
