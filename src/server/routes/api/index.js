const router = require('express').Router()
const newRouter = require('./new')
const whatsnew = require('./whats-new')
const token = require('../../utils/token-strategy')

router.use('/', token.auth())
router.use('/new', newRouter)
router.use('/whatsnew', whatsnew)

module.exports = router