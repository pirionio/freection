const router = require('express').Router()
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const token = require('../utils/token-strategy')
const {User} = require('../models')
const config = require('../config/google-oauth')
const logger = require('../utils/logger')

passport.use(new GoogleStrategy({
    clientID: config.clientID,
    clientSecret: config.clientSecret,
    callbackURL: config.callbackURL
}, function (accessToken, refreshToken, profile, cb) {
    const googleId = profile.id
    const firstName = profile.name.givenName
    const lastName = profile.name.familyName
    const email = profile.emails[0].value

    User.
        getUserByGoogleId(googleId).
        catch(e=> {
            if (e === "NotFound") {
                // creating new user
                return User.save({
                    createdAt: new Date(),
                    googleId,
                    email,
                    firstName,
                    lastName,
                    accessToken,
                    refreshToken
                })
            }
            else
                throw e
        }).
        then(u=> {
            logger.info(`new user ${u.firstName} ${u.lastName} ${u.email}`)
            cb(null, {
                id: u.id,
                email: u.email,
                firstName: u.firstName,
                lastName: u.lastName
            })
        }).
        catch(err=> cb(err))
}))

router.get('/logout', token.logout({redirect: '/'}))

router.get('/google', passport.authenticate('google', {
    accessType: 'offline',
    prompt:'consent',
    scope: [
        'profile',
        'email',
        'https://mail.google.com/']
}))

router.get('/google/callback',
    passport.authenticate('google', {session: false, failureRedirect: '/login'}),
    token.login({ redirect: '/'}))

module.exports = router