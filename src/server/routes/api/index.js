const router = require('express').Router()
const newRouter = require('./new')
const whatsnew = require('./whats-new')

router.use('/new', newRouter)
router.use('/whatsnew', whatsnew)

module.exports = router