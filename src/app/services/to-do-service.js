const ResourceUtil = require('../util/resource-util')

function getThingsToDo() {
    return ResourceUtil.get('/api/things/do')
}

module.exports = {getThingsToDo}