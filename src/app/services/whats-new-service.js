const ResourceUtil = require('../util/resource-util')

function getThings() {
    return ResourceUtil.get('/api/whatsnew/things')
}

module.exports = {getThings}