const router = require('express').Router()
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const token = require('../utils/token-strategy')
const {User} = require('../models')
const config = require('../config/google-oauth')
const logger = require('../utils/logger')
const googleapis = require('googleapis')

var oauth2Client = new googleapis.auth.OAuth2(config.clientID, config.clientSecret, config.callbackURL)

function saveNewUser(userData) {
    return User.save({
        createdAt: new Date(),
        googleId: userData.googleId,
        email: userData.email,
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
        lastName: user.lastName
    }
}

function generateOAuth2Url(prompt) {
    const request = {
        access_type: 'offline',
        scope: [
            'profile',
            'email',
            'https://mail.google.com/']
    }

    if (prompt) {
        request.prompt = prompt
    }

    return oauth2Client.generateAuthUrl(request)
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
                    return saveNewUser(userData)
                } else {
                    throw "MissingRefreshToken"
                }
            }
            else
                throw e
        }).
        then(user => {
            logger.info(`new user ${user.firstName} ${user.lastName} ${user.email}`)
            cb(null, createUserToken(user))
        }).
        catch(err=> {
            if (err === "MissingRefreshToken") {
                cb(null, {missingRefreshToken:true})
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
            const redirectUrl = generateOAuth2Url('consent')
            response.redirect(302, redirectUrl)
        } else {
            token.login({ redirect: '/'})(request, response, next)
        }
    })

module.exports = router