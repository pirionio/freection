const _ = require('lodash')

class Immutable {
    constructor(source) {
        this._object = _.clone(source)
    }

    touch(path) {
        const value = _.clone(_.get(this._object, path))
        _.set(this._object, path, value)

        return this
    }

    set(path, value) {
        _.set(this._object, path, value)

        return this
    }

    arrayReject(path, predicate) {
        const array = _.get(this._object, path)
        _.set(this._object, path, _.reject(array, predicate))

        return this
    }

    arrayMergeItem(path, predicate, updater) {
        const array = _.get(this._object, path)
        _.set(this._object, path, arraySetOrMergeItem(array, predicate, updater, true))

        return this
    }

    arrayPushItem(path, value) {
        const array = _.get(this._object, path)
        _.set(this._object, path, [...array, value])

        return this
    }

    arraySetItem(path, predicate, updater) {
        const array = _.get(this._object, path)
        _.set(this._object, path, arraySetOrMergeItem(array, predicate, updater, false))

        return this
    }
    
    arraySetOrPushItem(path, predicate, value) {
        const array = _.get(this._object, path)

        if (_.some(array, predicate))
            _.set(this._object, path, arraySetOrMergeItem(array, predicate, value, false))
        else
            _.set(this._object, path, [...array, value])

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
            return isMerge ? _.merge({}, item, value) : value
        } else {
            return item
        }
    })
}

function getItemValue(item, updater) {
    return _.isFunction(updater) ? updater(item) : updater
}

function matchItem(item, predicate) {
    if (_.isFunction(predicate)) {
        return predicate(item)
    }

    return _.isMatch(item, predicate)
}

function immutable(source) {
    return new Immutable(source)
}

module.exports = immutable
