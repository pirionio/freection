const GithubActionsTypes = {
    FETCH_GITHUB: 'GITHUB_FETCH_GITHUB',
    ENABLE_REPOSITORY: 'GITHUB_ENABLE_REPOSITORY',
    DISABLE_REPOSITORY: 'GITHUB_DISABLE_REPOSITORY'
}

export default GithubActionsTypes

export function isOfTypeGithub(type) {
    switch(type) {
        case GithubActionsTypes.FETCH_GITHUB:
        case GithubActionsTypes.ENABLE_REPOSITORY:
        case GithubActionsTypes.DISABLE_REPOSITORY:
            return true
        default:
            return false
    }
}