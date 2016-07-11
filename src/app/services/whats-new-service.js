require('isomorphic-fetch');

function getThings() {
    return fetch('/api/whatsnew/things').then(response => response.json())
}

module.exports = {getThings}