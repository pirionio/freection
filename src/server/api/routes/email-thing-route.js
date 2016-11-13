import {Router} from 'express'
import {find, toArray} from 'lodash'

import * as EndpointUtil from '../../shared/utils/endpoint-util'
import * as EmailService from '../../shared/application/email-service'
import DeviceType from '../../../common/enums/device-types'

const router = Router()

router.post('/', (request, response) => {
    EndpointUtil.handlePost(request, response, (user, emailData, isHex) => {
        return EmailService.newEmailThing(user, emailData, isHex, {sourceDevice: findDevice(request.device.type)})
    }, {
            body: ['emailData', 'isHex'],
            result: false,
            errorTemplates: {
                general: 'Error while creating a thing from email'
            }
        }
    )
})

function findDevice(deviceType) {
    return find(toArray(DeviceType), {expressDeviceType: deviceType})
}

export default router