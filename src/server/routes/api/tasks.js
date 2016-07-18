const router = require('express').Router()

const Thing = require('../../models/Thing')
const logger = require('../../utils/logger')

router.get('/:taskId', function(request, response) {
    const user = request.user
    const {taskId} = request.params

    getTask(taskId)
        .then(task => response.json(task))
        .catch(error => {
            logger.error(`error while fetching task ${taskId} for user ${user.email}`, error)
            if (error && error.name === 'DocumentNotFoundError') {
                response.status(404).send(`Task ${taskId} could not be found: ${error.message}`)
            } else {
                response.status(500).send(`Could not fetch task ${taskId}: ${error.message}`)
            }
        })
})

function getTask(taskId) {
    return Thing.getFullThing(taskId)
}

module.exports = router