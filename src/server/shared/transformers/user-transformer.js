const {pick} = require('lodash/core')

function docToDto(user) {
    return pick(user, ['id', 'firstName', 'lastName', 'email'])
}

module.exports = {docToDto}