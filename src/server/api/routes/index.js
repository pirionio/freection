const router = require('express').Router()

const newRouter = require('./new')
const things = require('./things')
const tasks = require('./tasks')
const token = require('../../shared/utils/token-strategy')

router.use('/', token.auth())
router.use('/new', newRouter)
router.use('/things', things)
router.use('/tasks', tasks)

module.exports = router