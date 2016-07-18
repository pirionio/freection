const ResourceUtil = require('../util/resource-util')

function getTask(taskId) {
    return ResourceUtil.get('/api/tasks/' + taskId)
}

module.exports = {getTask}