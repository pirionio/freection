import querystring from 'querystring'
import OAuth from 'oauth'

import config from '../config/trello'
import promisify from '../utils/promisify'

const oauthRequestUrl = 'https://trello.com/1/OAuthGetRequestToken'
const oauthAccessUrl = 'https://trello.com/1/OAuthGetAccessToken'
const oauthAuthorizeUrl = 'https://trello.com/1/OAuthAuthorizeToken'
const apiUrl = 'https://api.trello.com/1'

const oauth = new OAuth.OAuth(
    oauthRequestUrl,
    oauthAccessUrl,
    config.appKey,
    config.appSecret,
    '1.0',
    config.callbackURL,
    'HMAC-SHA1'
)

promisify(oauth, ['get', 'post', 'delete'])

export function authorize() {
    return new Promise((resolve, reject) => {
        oauth.getOAuthRequestToken((error, oAuthToken, oAuthTokenSecret) => {
            if (error) {
                reject({
                    message: 'Could not authorize user in Trello',
                    cause: error
                })
                return
            }

            const options = {
                oauth_token: oAuthToken,
                name: 'Freection',
                expiration: 'never',
                scope: 'read'
            }

            resolve({
                redirectUrl: `${oauthAuthorizeUrl}?${querystring.stringify(options)}`,
                requestToken: oAuthToken,
                requestTokenSecret: oAuthTokenSecret
            })
        })
    })
}

export function getAccessToken(requestToken, requestTokenSecret, verifier) {
    return new Promise((resolve, reject) => {

        oauth.getOAuthAccessToken(requestToken, requestTokenSecret, verifier, (error, accessToken, accessTokenSecret) => {
            if (error) {
                reject({
                    message: `Could not get access token for user in Trello`,
                    cause: error
                })
                return
            }

            oauth.get(`${apiUrl}/members/me?fields=username`, accessToken, accessTokenSecret, (meError, trelloUserString) => {
                if (meError) {
                    reject({
                        message: 'Could not find Trello user',
                        cause: meError
                    })
                    return
                }

                const trelloUser = JSON.parse(trelloUserString)

                resolve({
                    user: trelloUser,
                    accessToken,
                    accessTokenSecret
                })
            })
        })
    })
}

export async function getBoards({token, secret}) {
    return await oauth.getAsync(`${apiUrl}/members/me/boards`, token, secret)
}

export async function createWebhookForBoard(userId, boardId, {token, secret}) {
    return await oauth.postAsync(`${apiUrl}/webhooks`, token, secret, {
        idModel: boardId,
        callbackURL: `${config.webhookURL}/${userId}`
    }, 'application/json')
}

export async function deleteWebhook(webhookId, {token, secret}) {
    return await oauth.deleteAsync(`${apiUrl}/webhooks/${webhookId}`, token, secret)
}
