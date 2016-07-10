const newRouter = require('./new.js')
const router = require('express').Router()

router.use('/new', newRouter)

module.exports = router