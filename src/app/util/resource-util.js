import 'isomorphic-fetch'
import 'isomorphic-form-data'
import {polyfill} from 'es6-promise'
import toPairs from 'lodash/toPairs'

polyfill()

function checkStatus(response) {
    if (response.status >= 200 && response.status < 400) {
        return response
    }

    const error = new Error(response.statusText)
    error.response = response
    throw error
}

function parseJSON(response) {
    return response.json()
}

function parseText(response) {
    return response.text()
}

export function get(endpoint) {
    return fetch(endpoint, {
        credentials: 'include'
    }).then(checkStatus).then(parseJSON)
}

export function post(endpoint, bodyObject, { requestType = 'json', responseType = 'json'} = {}) {
    let body
    let headers

    if (requestType === 'json') {
        body = JSON.stringify(bodyObject)
        headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    } else if (requestType === 'form') {
        body = new FormData()
        headers = undefined
        toPairs(bodyObject).forEach(pair => body.append(pair[0], pair[1]))
    } else {
        throw 'UnknownRequestType'
    }

    return fetch(endpoint, {
        method: 'POST',
        credentials: 'include',
        headers,
        body
    }).then(checkStatus).then(responseType === 'json' ? parseJSON : parseText)
}