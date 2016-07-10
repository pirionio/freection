'use strict'
const express = require('express')
const path = require('path')

const app = new express()
app.set('port', (process.env.PORT || 3000))
app.use(express.static(path.join(__dirname, '../public')))

app.listen(app.get('port'), function () {
    console.log(`Running in ${app.get('env')} mode on port ${app.get('port')}`)
})

