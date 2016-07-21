const router = require('express').Router()

const TasksService = require('../../shared/services/tasks-service')

router.get('/:taskId', function(request, response) {
    const {taskId} = request.params

    TasksService.getTask(taskId)
        .then(task => response.json(task))
        .catch(error => {
            if (error && error.name === 'DocumentNotFoundError') {
                response.status(404).send(`Task ${taskId} could not be found: ${error.message}`)
            } else {
                response.status(500).send(`Could not fetch task ${taskId}: ${error.message}`)
            }
        })
})

module.exports = router