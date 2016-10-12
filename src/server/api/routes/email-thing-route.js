import {Router} from 'express'

import * as EndpointUtil from '../../shared/utils/endpoint-util'
import * as EmailService from '../../shared/application/email-service'

const router = Router()

router.post('/', (request, response) => {
    EndpointUtil.handlePost(request, response, EmailService.newEmailThing, {
        body: ['emailData', 'isHex'],
        result: false,
        errorTemplates: {
            general: 'Error while creating a thing from email'
        }
    })
})

export default router