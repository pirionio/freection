import {Router} from 'express'
import * as EndpointUtil from '../../shared/utils/endpoint-util'
import * as ContactService from '../../shared/application/contact-service'

const router = Router()

router.get('/', (request, response) => {
    EndpointUtil.handleGet(request, response, ContactService.get, {
        type: 'Contacts'
    })
})

export default router
