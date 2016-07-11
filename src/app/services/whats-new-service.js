function getThings() {
    return fetch('/api/whatsnew/things', {
        credentials: 'include'
    }).then(
        response => response.json()
    ).catch((response) => {
        throw new Error(response.message)
    })
}

module.exports = {getThings}