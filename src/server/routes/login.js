const router = require('express').Router()
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const token = require('../token')
const {User} = require('../models')

// TODO: clientID and clientSecret should come from ENV VAR
// TODO: on  Prod callback should be freection app url

passport.use(new GoogleStrategy({
    clientID: '593494787516-jsgh4pc441pcnf63rikc1gqltbbo6l5q.apps.googleusercontent.com',
    clientSecret: 'PoIM9wEtX66QZzJ_SgJ-qjtl',
    callbackURL: 'http://localhost:3000/login/google/callback'
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
        then(u=> cb(null, {id: u.id})).
        catch(err=> cb(err))
}))

router.get('/logout', token.logout({redirect: '/'}))

router.get('/google', passport.authenticate('google', {
    accessType: 'offline',
    scope: [
        'profile',
        'email',
        'https://mail.google.com/']
}))

router.get('/google/callback',
    passport.authenticate('google', {session: false, failureRedirect: '/login'}),
    token.login({ send: true}))

module.exports = router