import {Router} from 'express'

import token from '../../shared/utils/token-strategy'
import GeneralRoute from './general-route'
import NewRoute from './new-route'
import ThingRoute from './thing-route'
import EmailThingRoute from './email-thing-route'
import EventRoute from './event-route'
import GithubRoute from './github-route'
import SlackRoute from './slack-route'
import AsanaRoute from './asana-route'
import TrelloRoute from './trello-route'
import GoogleRoute from './google-route'
import ContactsRoute from './contacts-route'
import UserRoute from './user-route'
import BotRoute from './bot-route'

const router = Router()

router.use('/', token.auth())
router.use('/general', GeneralRoute)
router.use('/new', NewRoute)
router.use('/things', ThingRoute)
router.use('/emailthing', EmailThingRoute)
router.use('/events', EventRoute)
router.use('/github', GithubRoute)
router.use('/slack', SlackRoute)
router.use('/google', GoogleRoute)
router.use('/contacts', ContactsRoute)
router.use('/users', UserRoute)
router.use('/bot', BotRoute)
router.use('/asana', AsanaRoute)
router.use('/trello', TrelloRoute)

export default router