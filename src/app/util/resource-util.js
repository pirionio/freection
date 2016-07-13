require('es6-promise').polyfill()
require('isomorphic-fetch')

function checkStatus(response) {
    if (response.status >= 200 && response.status < 400) {
        return response
    } else {
        var error = new Error(response.statusText)
        error.response = response
        throw error
    }
}

function parseJSON(response) {
    return response.json()
}

function get(endpoint) {
    return fetch(endpoint, {
        credentials: 'include'
    }).then(checkStatus).then(parseJSON)
}

function post(endpoint, body) {
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

module.exports = {get, post}