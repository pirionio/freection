import now from 'lodash/now'

// 86400 seconds in a day
const msInDay = 86400*1000

function checkExpire(expire, email) {

    // we take one extra day as we check every day
    if (now() > expire - msInDay)
        relogin(email)
}

export function relogin(email) {
    window.location = `/login/google?hint=${email}`
}

export function initialize({expire, email}) {
    checkExpire(expire, email)

    setInterval(() => checkExpire(expire, email), msInDay)
}
