const {isUndefined} = require('lodash')

function docToDto(payload, user) {
    if (isUndefined(payload.isRead)) {
        return Object.assign({}, payload, {
            isRead: payload.readByList.includes(user.id),
            readByList: undefined
        })
    } else {
        return payload
    }
}

module.exports = {docToDto}
