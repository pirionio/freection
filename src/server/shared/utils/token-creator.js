export function createUserToken(user) {
    return {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        organization: user.organization,
        username: user.username,
        slack: user.integrations && user.integrations.slack && user.integrations.slack.active,
        github: user.integrations && user.integrations.github && user.integrations.github.active,
        allowSendGmail: user.integrations && user.integrations.gmail && user.integrations.gmail.allowSendMail
    }
}
