const {omit} = require('lodash')

const {Thing} = require('../models')
const EventTransformer = require('../transformers/event-transformer')
const ThingTransformer = require('../transformers/thing-transformer')
const logger = require('../utils/logger')

function getTask(taskId) {
    return Thing.getFullThing(taskId)
        .then(ThingTransformer.docToDto)
        .then(task => Object.assign(task, {
            comments: task.comments.map(comment => EventTransformer.docToDto(omit(comment, 'thing', 'eventType'), true))
        }))
        .catch(error => {
            logger.error(`error while fetching task ${taskId}`, error)
            throw error
        })
}

module.exports = {
    getTask
}