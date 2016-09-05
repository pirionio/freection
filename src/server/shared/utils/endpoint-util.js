import {template, zipObject, merge} from 'lodash'

import logger from '../../shared/utils/logger'

export function handleGet(request, response, action, options) {
    const user = request.user

    const params = getParams(request, options)

    action(user, ...params)
        .then(result => response.json(result))
        .catch(error => {
            logger.error(`Error while getting ${options.type}`, error)
            response.status(500).send(`Could not find ${options.type} for user ${user.email}: ${error.message}`)
        })
}

export function handlePost(request, response, action, options) {
    const {user} = request

    const params = getParams(request, options)
    const notFoundError = getNotFoundErrorMessage(options, user, params)
    const generalError = getGeneralErrorMessage(options, user, params)

    action(user, ...params)
        .then(result => response.json(options.result ? result : {}))
        .catch(error => {
            logger.error(generalError, error)

            if (error && error.name === 'DocumentNotFoundError' && notFoundError) {
                response.status(404).send(notFoundError)
            } else {
                response.status(500).send(`${generalError}: ${error.message}`)
            }
        })
}

function getParams(request, options) {
    const params = []

    options.params && options.params.forEach(paramName => params.push(request.params[paramName]))
    options.body && options.body.forEach(paramName => params.push(request.body[paramName]))

    return params
}

function getNotFoundErrorMessage(options, user, params) {
    return options.errorTemplates && options.errorTemplates.notFound ?
        template(options.errorTemplates.notFound)(getTemplateOptions(options, user, params)) :
        null
}

function getGeneralErrorMessage(options, user, params) {
    return options.errorTemplates && options.errorTemplates.general ?
        template(options.errorTemplates.general)(getTemplateOptions(options, user, params)) :
        null
}

function getTemplateOptions(options, user, params) {
    return merge({
        user: user.email,
    }, zipObject(options.params, params), zipObject(options.body, params))
}