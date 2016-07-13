const router = require('express').Router()
const newRouter = require('./new')
const things = require('./things')
const token = require('../../utils/token-strategy')

router.use('/', token.auth())
router.use('/new', newRouter)
router.use('/things', things)

module.exports = router