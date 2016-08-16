const router = require('express').Router()

const EndpointUtil = require('../../shared/utils/endpoint-util')
const ContactService = require('../../shared/application/contact-service')

router.get('/', function(request, response) {
    EndpointUtil.handleGet(request, response, ContactService.get, {
       type: 'Contacts'
    })
})

module.exports = router
