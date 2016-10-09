function tagSession(tag) {
    if (__insp)
        __insp.push(['tagSession', tag])
}

export function identify(user) {
    if (__insp)
        __insp.push(['identify', user.email])
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

