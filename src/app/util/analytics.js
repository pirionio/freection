function tagSession(tag) {
    if (typeof __insp !== 'undefined' && __insp)
        __insp.push(['tagSession', tag])
}

export function initialize(user) {
    if (typeof __insp !== 'undefined' && __insp)
        __insp.push(['identify', user.email])

    if (window.FS) {
        window.FS.identify(user.id, {
            displayName: `${user.firstName} ${user.lastName}`,
            email: user.email,
            organization_str: user.organization
        })
    }

    if (window.Intercom) {
        window.Intercom('boot', {
            app_id: 's9inbvkn',
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            user_id: user.id,
            company: {
                name: user.organization,
                id: user.organization
            },
            slack: user.slack,
            github: user.github,
            hostname: window.location.hostname
        })
    }

    if (window._cio) {
        window._cio.identify({
            id: user.id,
            email: user.email,
            name: `${user.firstName} ${user.lastName}`
        })
    }
}

export function clean() {
    if (window.Intercom) {
        window.Intercom('shutdown')
    }

    if (window.FS)
        window.FS.clearUserCookie(true)
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

export function unmute() {
    tagSession('unmute')
}

export function mute() {
    tagSession('mute')
}

export function followup() {
    tagSession('followup')
}

export function unfollow() {
    tagSession('unfollow')
}
