const fs = require('fs')
const models = require('../src/app/actions/models')
const {camelCase, snakeCase, toUpper, repeat,
    upperFirst, kebabCase, isFunction, toPairs, some} = require('lodash')

function generateActionsCode(model) {
    const actionsFileName = getActionsFilename(model.name)
    const actionsPath = `./src/app/actions/generated/${actionsFileName}.js`

    const actionsCode = model.actions.map(action => {
        if (isFunction(action)) {
            return action.toString() + '\r\n'
        }
        else if (action.type === 'post' || action.type === 'get')
            return generateAsyncActionCode(model.name, action)
        else
            return generateActionCode(model.name, action)
    }).join('\r\n')

    const code = generateRequireCode(model) + '\r\n' + actionsCode

    fs.writeFileSync(actionsPath, code)
}

function generateRequireCode(model) {
    const requires = model.requires ? model.requires : []

    const trackEnabled = some(model.actions, action => !!action.track)

    return `import ${getTypesVariable(model.name)} from '../types/${getTypesFilename(model.name)}'\r\n` +
            `import {ActionStatus} from '../../constants'\r\n` +
            `import * as ResourceUtil from '../../util/resource-util'\r\n` +
            (trackEnabled ? `import * as analytics from '../../util/analytics'\r\n` : '') +
            toPairs(requires).map(_require => `import ${_require[0]} from '${_require[1]}'\r\n`).join('')
}

function generateActionCode(modelName, action) {
    const actionName = action.name
    const functionName = getFunctionName(action)
    const typeName = `${getTypesVariable(modelName)}.${getTypeName(actionName)}`
    const params = action.params ? action.params : []
    const restOfParamsComma = params.length > 0 ? ',\r\n' : ''

    return `export function ${functionName}(${params.join()}) {\r\n` +
            `    return {\r\n` +
            `        type: ${typeName}${restOfParamsComma}` +
            `        ${params.join(',\r\n        ')}\r\n` +
            `    }\r\n` +
            '}\r\n'
}

function generateAsyncActionCode(modelName, action) {
    const method = action.type
    const actionName = action.name
    const postPath = action.path
    const functionName = getFunctionName(action)
    const typeName = `${getTypesVariable(modelName)}.${getTypeName(actionName)}`
    const params = action.params ? action.params : []
    const completeParams = action.completeParams ?
        pairsToStrings(action.completeParams) : params
    const restOfParamsComma = params.length > 0 ? ',\r\n' : ''
    const restOfCompleteParamsComma = completeParams.length > 0 ? ',\r\n' : ''
    const body = action.body ? `, ${generateBody( action.body, 3)}` : ''

    return `export function ${functionName}(${params.join(', ')}) {\r\n` +
        `    return dispatch => {\r\n` +
        getAnalyticsCode(action) +
        `        dispatch({\r\n` +
        `            type: ${typeName}, \r\n` +
        `            status: ActionStatus.START${restOfParamsComma}` +
        `            ${params.join(',\r\n            ')}\r\n` +
        `        })\r\n` +
        `        return ResourceUtil.${method}(\`${postPath}\`${body})\r\n` +
        `            .then(result => dispatch({\r\n` +
        `                type: ${typeName}, \r\n` +
        `                status: ActionStatus.COMPLETE${restOfCompleteParamsComma}` +
        `                ${completeParams.join(',\r\n                ')}\r\n` +
        `            }))\r\n` +
        `            .catch(() => dispatch({\r\n` +
        `                type: ${typeName}, \r\n` +
        `                status: ActionStatus.ERROR${restOfParamsComma}` +
        `                ${params.join(',\r\n                ')}\r\n` +
        `            }))\r\n` +
        `    }\r\n` +
        `}\r\n`
}

function getAnalyticsCode(action) {
    if (action.track) {
        const params = action.trackParams ? action.trackParams.join(', ') : ''

        return `        analytics.${action.track}(${params})\r\n\r\n`
    }

    return ''
}

function pairsToStrings(params) {
    return toPairs(params).map(pair => `${pair[0]}: ${pair[1]}`)
}

function generateBody(body, indent) {
    const space = repeat(' ', indent * 4)
    const innerSpace = repeat(' ', (indent+1) * 4)
    const seperator = `,\r\n${innerSpace}`

    return `{\r\n${innerSpace}` +
        pairsToStrings(body).join(seperator) +
        `\r\n${space}}`
}

function getFunctionName(action) {
    return action.private ? '_' + camelCase(action.name) : camelCase(action.name)
}

function getTypeName(actionName) {
    return toUpper(snakeCase(actionName))
}

function getTypesVariable(modelName) {
    return `${upperFirst(camelCase(modelName))}ActionsTypes`
}

function getTypesFilename(modelName) {
    return `${kebabCase(modelName)}-action-types`
}

function getActionsFilename(modelName) {
    return `${kebabCase(modelName)}-actions`
}

function generateTypesCode(model) {
    const modelName = getTypeName(model.name)
    const typesFileName = getTypesFilename(model.name)
    const typesPath =  `./src/app/actions/types/${typesFileName}.js`

    const code = `export default {\r\n` +
        `    ${model.actions.map(action => {
            const typeName = getTypeName(action.name)
            return `${typeName}: '${modelName}_${typeName}'`
        }).join(',\r\n    ')}\r\n` +
        '}'

    fs.writeFileSync(typesPath, code)
}

function generateDefaultFile(model) {
    const fileName = getActionsFilename(model.name)
    const path =  `./src/app/actions/${fileName}.js`

    try {
        fs.accessSync(path)
    } catch (err) {
        const code = `export * from './generated/${fileName}'`

        fs.writeFileSync(path, code)
    }
}

models.forEach(generateActionsCode)
models.forEach(generateTypesCode)
models.forEach(generateDefaultFile)
