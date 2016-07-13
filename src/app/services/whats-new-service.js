const ResourceUtil = require('../util/resource-util')

function getThings() {
    return ResourceUtil.get('/api/things/whatsnew')
}

module.exports = {getThings}