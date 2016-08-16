function getOrganization(email) {
    return email.substr(email.indexOf('@') + 1)
}

function getUsername(email) {
    return email.substr(0, email.indexOf('@'))
}

module.exports = {getOrganization, getUsername}