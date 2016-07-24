const {set, some, get, merge} = require('lodash')

class Immutable {
    constructor(source) {
        this._object = Object.assign({}, source)
    }

    touch(path) {
        const value = Object.assign({}, get(this._object, path))
        set(this._object, path, value)

        return this
    }

    arrayUpdateItem(path, predicate, updater) {
        const array = get(this._object, path)

        set(this._object, path, array.map(item => {
            if (predicate(item))
                return updater(item)
            else
                return item
        }))

        return this
    }

    arraySetOrPushItem(path, predicate, value) {
        const array = get(this._object, path)

        if (some(array, predicate))
            this.arraySetItem(path, predicate, value)
        else
            this.pushToArray(path, value)

        return this
    }

    arraySetItem(path, predicate, value) {
        const array = get(this._object, path)

        set(this._object, path, array.map(item => {
            if (predicate(item))
                return value
            else
                return item
        }))

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
