import * as ChromeExtensionActions from '../actions/chrome-extension-actions'

export function instsallChromeExtension(dispatch) {
    return new Promise((resolve, reject) => {
        chrome.webstore.install('',
            result => {
                dispatch(ChromeExtensionActions.setIsInstalled(true))
                resolve(result)
            },
            error => {
                reject(error)
            }
        )
    })
}

export function getSlackUrl() {
    return '/api/slack/integrate'
}

export function getTrelloUrl() {
    return '/api/trello/integrate'
}

export function getAsanaUrl() {
    return '/api/asana/integrate'
}

export function getGithubUrl() {
    return '/api/github/integrate'
}