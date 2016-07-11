function createNewThing(thing) {
    return fetch('/api/new', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(thing)
    })
}

module.exports = {createNewThing}