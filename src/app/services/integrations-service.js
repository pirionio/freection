
export function instsallChromeExtension() {
    chrome.webstore.install()
}

export function getSlackUrl() {
    return '/api/slack/integrate'
}

export function getTrelloUrl() {
    return '/api/trello/integrate'
}