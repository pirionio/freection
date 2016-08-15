const fs = require('fs')
const models = require('../src/app/actions/models')
const {camelCase, snakeCase, toUpper, repeat, isString,
    upperFirst, kebabCase, isFunction, toPairs} = require('lodash')

function generateActionsCode(model) {
    const actionsFileName = getActionsFilename(model.name)
    const actionsPath = `./src/app/actions/generated/${actionsFileName}.js`

    const actionsCode = model.actions.map(action => {
        if (isFunction(action)) {
            return action.toString() + '\r\n'
        }
        else if (action.type === 'post' || action.type === 'get')
            return generateAsyncActionCode(model.name, action)
        else if (action.type !== 'custom')
            return generateActionCode(model.name, action)
    }).join('\r\n')

    const code = generateRequireCode(model) + '\r\n' + actionsCode + '\r\n' +
        generateExportCode(model.actions)

    fs.writeFileSync(actionsPath, code)
}

function generateRequireCode(model) {
    const requires = model.requires ? model.requires : []

    return `const ${getTypesVariable(model.name)} = require('../types/${getTypesFilename(model.name)}')\r\n` +
            `const {ActionStatus} = require('../../constants')\r\n` +
            `const ResourceUtil = require('../../util/resource-util')\r\n` +
            toPairs(requires).map(_require => `const ${_require[0]} = require('${_require[1]}')\r\n`).join('')
}

function generateExportCode(actions) {
    return `module.exports = {\r\n` +
            `    ${actions.filter(action => action.type != 'custom')
                .map(action => getFunctionName(action.name)).join(',\r\n    ')}\r\n` +
            `}`
}

function generateActionCode(modelName, action) {
    const actionName = action.name
    const functionName = getFunctionName(actionName)
    const typeName = `${getTypesVariable(modelName)}.${getTypeName(actionName)}`
    const params = action.params ? action.params : []
    const restOfParamsComma = params.length > 0 ? ',\r\n' : ''

    return `function ${functionName}(${params.join()}) {\r\n` +
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
    const functionName = getFunctionName(actionName)
    const typeName = `${getTypesVariable(modelName)}.${getTypeName(actionName)}`
    const params = action.params ? action.params : []
    const completeParams = action.completeParams ?
        pairsToStrings(action.completeParams) : params
    const restOfParamsComma = params.length > 0 ? ',\r\n' : ''
    const restOfCompleteParamsComma = completeParams.length > 0 ? ',\r\n' : ''
    const body = action.body ? `, ${generateBody( action.body, 3)}` : ''

    return `function ${functionName}(${params.join(', ')}) {\r\n` +
        `    return dispatch => {\r\n` +
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

function getFunctionName(actionName) {
    return camelCase(actionName)
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

    const code = `module.exports = {\r\n` +
        `    ${model.actions.map(action => {
            const typeName = getTypeName(action.name)
            return `${typeName}: '${modelName}_${typeName}'`
        }).join(',\r\n    ')}\r\n` +
        `}`

    fs.writeFileSync(typesPath, code)
}

function generateDefaultFile(model) {
    const fileName = getActionsFilename(model.name)
    const path =  `./src/app/actions/${fileName}.js`

    const actionsVariable = `${upperFirst(camelCase(model.name))}Actions`

    try {
        fs.accessSync(path)
    } catch (err) {
        const code = `const ${actionsVariable} = require('./generated/${fileName}')\r\n\r\n` +
                `module.exports = ${actionsVariable}`

        fs.writeFileSync(path, code)
    }
}

models.forEach(generateActionsCode)
models.forEach(generateTypesCode)
models.forEach(generateDefaultFile)
