const Thing = require('../models/Thing')
const logger = require('../utils/logger')

function getTask(taskId) {
    return Thing.getFullThing(taskId)
        .catch(error => {
            logger.error(`error while fetching task ${taskId}`, error)
            throw error
        })
}

module.exports = {
    getTask
}