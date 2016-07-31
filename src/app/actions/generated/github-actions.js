const GithubActionsTypes = require('../types/github-action-types')
const {ActionStatus} = require('../../constants')
const ResourceUtil = require('../../util/resource-util')

function fetchGithub() {
    return dispatch => {
        dispatch({
            type: GithubActionsTypes.FETCH_GITHUB, 
            status: ActionStatus.START            
        })
        return ResourceUtil.get(`/api/github`)
            .then(result => dispatch({
                type: GithubActionsTypes.FETCH_GITHUB, 
                status: ActionStatus.COMPLETE,
                github: result
            }))
            .catch(() => dispatch({
                type: GithubActionsTypes.FETCH_GITHUB, 
                status: ActionStatus.ERROR                
            }))
    }
}

function enableRepository(repositoryId) {
    return dispatch => {
        dispatch({
            type: GithubActionsTypes.ENABLE_REPOSITORY, 
            status: ActionStatus.START,
            repositoryId
        })
        return ResourceUtil.post(`/api/github/enablerepository/${repositoryId}`)
            .then(result => dispatch({
                type: GithubActionsTypes.ENABLE_REPOSITORY, 
                status: ActionStatus.COMPLETE,
                repositoryId
            }))
            .catch(() => dispatch({
                type: GithubActionsTypes.ENABLE_REPOSITORY, 
                status: ActionStatus.ERROR,
                repositoryId
            }))
    }
}

function disableRepository(repositoryId) {
    return dispatch => {
        dispatch({
            type: GithubActionsTypes.DISABLE_REPOSITORY, 
            status: ActionStatus.START,
            repositoryId
        })
        return ResourceUtil.post(`/api/github/disablerepository/${repositoryId}`)
            .then(result => dispatch({
                type: GithubActionsTypes.DISABLE_REPOSITORY, 
                status: ActionStatus.COMPLETE,
                repositoryId
            }))
            .catch(() => dispatch({
                type: GithubActionsTypes.DISABLE_REPOSITORY, 
                status: ActionStatus.ERROR,
                repositoryId
            }))
    }
}

module.exports = {
    fetchGithub,
    enableRepository,
    disableRepository
}