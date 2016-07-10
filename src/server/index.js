'use strict'
const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const api = require('./routes/api')

const app = new express()
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, '../public')))
app.use('/api', api)

app.set('port', (process.env.PORT || 3000))
app.listen(app.get('port'), function () {
    console.log(`Running in ${app.get('env')} mode on port ${app.get('port')}`)
})


