const ResourceUtil = require('../util/resource-util')

function getNotifications() {
    return ResourceUtil.get('/api/things/whatsnew')
}

module.exports = {getNotifications}