import 'isomorphic-fetch'
import {polyfill} from 'es6-promise'

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

export function get(endpoint) {
    return fetch(endpoint, {
        credentials: 'include'
    }).then(checkStatus).then(parseJSON)
}

export function post(endpoint, body) {
    return fetch(endpoint, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(body)
    }).then(checkStatus).then(parseJSON)
}