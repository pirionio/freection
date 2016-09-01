const router = require('express').Router()

import * as EndpointUtil from '../../shared/utils/endpoint-util'
import * as ContactService from '../../shared/application/contact-service'

router.get('/', function(request, response) {
    EndpointUtil.handleGet(request, response, ContactService.get, {
       type: 'Contacts'
    })
})

module.exports = router
