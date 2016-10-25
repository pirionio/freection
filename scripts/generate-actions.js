const fs = require('fs')
const models = require('../src/app/actions/models')
const {camelCase, snakeCase, toUpper, repeat,
    upperFirst, kebabCase, isFunction, toPairs, some} = require('lodash')

const isWin = /^win/.test(process.platform)
const EOL = isWin ? '\r\n' : '\n'

function generateActionsCode(model) {
    const actionsFileName = getActionsFilename(model.name)
    const actionsPath = `./src/app/actions/generated/${actionsFileName}.js`

    const actionsCode = model.actions.map(action => {
        if (isFunction(action)) {
            return action.toString() + EOL
        }
        else if (action.type === 'post' || action.type === 'get')
            return generateAsyncActionCode(model.name, action)
        else
            return generateActionCode(model.name, action)
    }).join(EOL)

    const code = generateRequireCode(model) + EOL + actionsCode

    fs.writeFileSync(actionsPath, code)
}

function generateRequireCode(model) {
    const requires = model.requires ? model.requires : []

    const trackEnabled = some(model.actions, action => !!action.track)

    return `import ${getTypesVariable(model.name)} from '../types/${getTypesFilename(model.name)}'${EOL}` +
            `import {ActionStatus} from '../../constants'${EOL}` +
            `import * as ResourceUtil from '../../util/resource-util'${EOL}` +
            (trackEnabled ? `import * as analytics from '../../util/analytics'${EOL}` : '') +
            toPairs(requires).map(_require => `import ${_require[0]} from '${_require[1]}'${EOL}`).join('')
}

function generateActionCode(modelName, action) {
    const actionName = action.name
    const functionName = getFunctionName(action)
    const typeName = `${getTypesVariable(modelName)}.${getTypeName(actionName)}`
    const params = action.params ? action.params : []
    const restOfParamsComma = params.length > 0 ? `,${EOL}` : ''

    return `export function ${functionName}(${params.join()}) {${EOL}` +
            `    return {${EOL}` +
            `        type: ${typeName}${restOfParamsComma}` +
            `        ${params.join(`,${EOL}        `)}${EOL}` +
            `    }${EOL}` +
            `}${EOL}`
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
    const restOfParamsComma = params.length > 0 ? `,${EOL}` : ''
    const restOfCompleteParamsComma = completeParams.length > 0 ? `,${EOL}` : ''
    const body = action.body ? `, ${generateBody( action.body, 3)}` : ''

    return `export function ${functionName}(${params.join(', ')}) {${EOL}` +
        `    return dispatch => {${EOL}` +
        getAnalyticsCode(action) +
        `        dispatch({${EOL}` +
        `            type: ${typeName}, ${EOL}` +
        `            status: ActionStatus.START${restOfParamsComma}` +
        `            ${params.join(`,${EOL}            `)}${EOL}` +
        `        })${EOL}` +
        `        return ResourceUtil.${method}(\`${postPath}\`${body})${EOL}` +
        `            .then(result => dispatch({${EOL}` +
        `                type: ${typeName}, ${EOL}` +
        `                status: ActionStatus.COMPLETE${restOfCompleteParamsComma}` +
        `                ${completeParams.join(`,${EOL}                `)}${EOL}` +
        `            }))${EOL}` +
        `            .catch(() => dispatch({${EOL}` +
        `                type: ${typeName}, ${EOL}` +
        `                status: ActionStatus.ERROR${restOfParamsComma}` +
        `                ${params.join(`,${EOL}                `)}${EOL}` +
        `            }))${EOL}` +
        `    }${EOL}` +
        `}${EOL}`
}

function getAnalyticsCode(action) {
    if (action.track) {
        const params = action.trackParams ? action.trackParams.join(', ') : ''

        return `        analytics.${action.track}(${params})${EOL}${EOL}`
    }

    return ''
}

function pairsToStrings(params) {
    return toPairs(params).map(pair => `${pair[0]}: ${pair[1]}`)
}

function generateBody(body, indent) {
    const space = repeat(' ', indent * 4)
    const innerSpace = repeat(' ', (indent+1) * 4)
    const seperator = `,${EOL}${innerSpace}`

    return `{${EOL}${innerSpace}` +
        pairsToStrings(body).join(seperator) +
        `${EOL}${space}}`
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

function pascalCase(modelName) {
    return upperFirst(camelCase(modelName))
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
    const typesConst = getTypesVariable(model.name)

    const typesCode = `const ${typesConst} = {${EOL}` +
        `    ${model.actions.map(action => {
            const typeName = getTypeName(action.name)
            return `${typeName}: '${modelName}_${typeName}'`
        }).join(`,${EOL}    `)}${EOL}` +
        `}${EOL}${EOL}` +
        `export default ${typesConst}${EOL}${EOL}`

    const isActionOfType = `export function isOfType${pascalCase(model.name)}(type) {${EOL}` +
            `    switch(type) {${EOL}` +
            model.actions.map(action => `        case ${typesConst}.${getTypeName(action.name)}:${EOL}`).join('') +
            `            return true${EOL}` +
            `        default:${EOL}` +
            `            return false${EOL}` +
            `    }${EOL}` +
            `}`

    fs.writeFileSync(typesPath, typesCode + isActionOfType)
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
