const {omit} = require('lodash')

const {Thing, Event} = require('../models')
const EventTransformer = require('../transformers/event-transformer')
const ThingTransformer = require('../transformers/thing-transformer')
const logger = require('../utils/logger')

function getTask(taskId) {
    return Thing.getFullThing(taskId)
        .then(ThingTransformer.docToDto)
        .then(task => {
            return Event.getCommentsForThing(taskId).then(comments => {
                task.comments = comments.map(comment => EventTransformer.docToDto(omit(comment, 'thing', 'eventType')))
                return task
            })
        })
        .catch(error => {
            logger.error(`error while fetching task ${taskId}`, error)
            throw error
        })
}

module.exports = {
    getTask
}