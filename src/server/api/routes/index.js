import {Router} from 'express'

import token from '../../shared/utils/token-strategy'
import NewRoute from './new-route'
import ThingRoute from './thing-route'
import EventRoute from './event-route'
import GithubRoute from './github-route'
import SlackRoute from './slack-route'
import ContactsRoute from './contacts-route'

const router = Router()

router.use('/', token.auth())
router.use('/new', NewRoute)
router.use('/things', ThingRoute)
router.use('/events', EventRoute)
router.use('/github', GithubRoute)
router.use('/slack', SlackRoute)
router.use('/contacts', ContactsRoute)

export default router