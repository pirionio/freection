const router = require('express').Router()

const NewRoute = require('./new-route')
const ThingRoute = require('./thing-route')
const EventRoute = require('./event-route')
const GithubRoute = require('./github-route')
const ContactsRoute = require('./contacts-route')

const token = require('../../shared/utils/token-strategy')

router.use('/', token.auth())
router.use('/new', NewRoute)
router.use('/things', ThingRoute)
router.use('/events', EventRoute)
router.use('/github', GithubRoute)
router.use('/contacts', ContactsRoute)

module.exports = router