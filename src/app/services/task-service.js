const ResourceUtil = require('../util/resource-util')

function getTask(taskId) {
    return ResourceUtil.get('/api/things/' + taskId)
}

module.exports = {getTask}