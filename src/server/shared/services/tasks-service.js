const {omit} = require('lodash')

const {Thing} = require('../models')
const {thingToDto} = require('../transformers')
const logger = require('../utils/logger')

function getTask(taskId, user) {
    return Thing.getFullThing(taskId)
        .then(thing => thingToDto(thing, user))
        .catch(error => {
            logger.error(`error while fetching task ${taskId}`, error)
            throw error
        })
}

module.exports = {
    getTask
}