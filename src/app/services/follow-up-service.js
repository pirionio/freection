const ResourceUtil = require('../util/resource-util')

function getFollowUps() {
    return ResourceUtil.get('/api/things/followups')
}

module.exports = {getFollowUps}