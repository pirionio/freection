export function getOrganization(email) {
    return email.substr(email.indexOf('@') + 1)
}

export function getUsername(email) {
    return email.substr(0, email.indexOf('@'))
}