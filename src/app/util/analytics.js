function tagSession(tag) {
    if (typeof __insp !== 'undefined' && __insp)
        __insp.push(['tagSession', tag])
}

export function initialize(user) {
    if (typeof __insp !== 'undefined' && __insp)
        __insp.push(['identify', user.email])

    if (window.Intercom) {
        window.Intercom('boot', {
            app_id: 's9inbvkn',
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            user_id: user.id
            //created_at: 1312182000 // Unix timestamp, TODO: we don't have this information from server
        })
    }
}

export function newThing() {
    tagSession('newThing')
}

export function comment() {
    tagSession('comment')
}

export function ping() {
    tagSession('ping')
}

export function pong() {
    tagSession('pong')
}

export function doThing() {
    tagSession('doThing')
}

export function close() {
    tagSession('close')
}

export function dismiss() {
    tagSession('dismiss')
}

export function done() {
    tagSession('done')
}

export function discard() {
    tagSession('discard')
}

export function sendback() {
    tagSession('sendback')
}

export function join() {
    tagSession('join')
}

export function leave() {
    tagSession('leave')
}

