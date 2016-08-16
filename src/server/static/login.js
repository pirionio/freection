const router = require('express').Router()
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const querystring = require('querystring')

const {User} = require('../shared/models')
const config = require('../shared/config/google-oauth')
const token = require('../shared/utils/token-strategy')
const logger = require('../shared/utils/logger')
const EmailParsingUtility = require('../shared/utils/email-parsing-utility')

function saveNewUser(userData) {
    const {email} = userData
    const organization = EmailParsingUtility.getOrganization(email)
    const username = EmailParsingUtility.getUsername(email)

    return User.save({
        createdAt: new Date(),
        googleId: userData.googleId,
        username,
        organization,
        email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        accessToken: userData.accessToken,
        refreshToken: userData.refreshToken
    })
}

function createUserToken(user) {
    return {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        organization: user.organization,
        username: user.username
    }
}

function generateOAuth2Url(prompt, loginHint) {
    const oauthUrl = 'https://accounts.google.com/o/oauth2/auth'
    const scope = [
        'profile',
        'email',
        'https://mail.google.com/']

    const options = Object.assign({
        response_type: 'code',
        client_id: config.clientID,
        redirect_uri: config.callbackURL,
        access_type: 'offline',
        scope: scope.join(' ')
    }, prompt ? { prompt } : {}, loginHint ? {login_hint: loginHint} : {})

    return oauthUrl + '?' + querystring.stringify(options)
}

passport.use(new GoogleStrategy({
    clientID: config.clientID,
    clientSecret: config.clientSecret,
    callbackURL: config.callbackURL
}, function (accessToken, refreshToken, profile, cb) {

    const userData = {
        googleId: profile.id,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        email: profile.emails[0].value,
        accessToken,
        refreshToken
    }

    User.
        getUserByGoogleId(userData.googleId).
        catch(e=> {
            if (e === "NotFound") {
                if (userData.refreshToken) {
                    return saveNewUser(userData).
                        then(user => {
                            logger.info(`new user ${user.firstName} ${user.lastName} ${user.email}`)
                            return user
                        })
                } else {
                    throw "MissingRefreshToken"
                }
            }
            else
                throw e
        }).
        then(user => cb(null, createUserToken(user))).
        catch(err=> {
            if (err === "MissingRefreshToken") {
                logger.info(
                    `missing refresh token for new user ${userData.firstName} ${userData.lastName} ${userData.email}`)
                cb(null, {missingRefreshToken:true, email: userData.email})
            } else {
                cb(err)
            }
        })
}))

router.get('/logout', token.logout({redirect: '/'}))

router.get('/google', function(request, response) {
    const redirectUrl = generateOAuth2Url()
    response.redirect(302, redirectUrl)
})

router.get('/google/callback',
    passport.authenticate('google', {session: false, failureRedirect: '/login'}), function(request, response, next) {
        if (request.user.missingRefreshToken) {
            const redirectUrl = generateOAuth2Url('consent', request.user.email)
            response.redirect(302, redirectUrl)
        } else {
            token.login({ redirect: '/', expiresIn: '30 days' })(request, response, next)
        }
    })

module.exports = router