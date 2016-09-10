import GithubActionsTypes from '../types/github-action-types'
import {ActionStatus} from '../../constants'
import * as ResourceUtil from '../../util/resource-util'

export function fetchGithub() {
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

export function enableRepository(fullName) {
    return dispatch => {
        dispatch({
            type: GithubActionsTypes.ENABLE_REPOSITORY, 
            status: ActionStatus.START,
            fullName
        })
        return ResourceUtil.post(`/api/github/enablerepository/${fullName}`)
            .then(result => dispatch({
                type: GithubActionsTypes.ENABLE_REPOSITORY, 
                status: ActionStatus.COMPLETE,
                fullName
            }))
            .catch(() => dispatch({
                type: GithubActionsTypes.ENABLE_REPOSITORY, 
                status: ActionStatus.ERROR,
                fullName
            }))
    }
}

export function disableRepository(fullName) {
    return dispatch => {
        dispatch({
            type: GithubActionsTypes.DISABLE_REPOSITORY, 
            status: ActionStatus.START,
            fullName
        })
        return ResourceUtil.post(`/api/github/disablerepository/${fullName}`)
            .then(result => dispatch({
                type: GithubActionsTypes.DISABLE_REPOSITORY, 
                status: ActionStatus.COMPLETE,
                fullName
            }))
            .catch(() => dispatch({
                type: GithubActionsTypes.DISABLE_REPOSITORY, 
                status: ActionStatus.ERROR,
                fullName
            }))
    }
}
