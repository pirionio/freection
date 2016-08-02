const find = require('lodash/find')

function getChildOfType(children, type) {
    return find(children, child => child.type.name === type.name)
}

module.exports = {getChildOfType}