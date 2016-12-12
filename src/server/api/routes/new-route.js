import {Router} from 'express'
import AddressParser from 'email-addresses'
import {find, toArray, isString} from 'lodash'

import * as EndpointUtil from '../../shared/utils/endpoint-util'
import * as ThingService from '../../shared/application/thing-service'
import * as EmailService from '../../shared/application/email-service'
import DeviceType from '../../../common/enums/device-types'

const router = Router()

router.post('/thing', (request, response) => {
    if (!isValid(request, response)) {
        return
    }

    const newThing = (user, to, subject, text, html) => {
        // request.device exists due to the use of the express-device middleware.
        return ThingService.newThing(user, to, {subject, text, html}, {sourceDevice: findDevice(request.device.type)})
    }

    EndpointUtil.handlePost(request, response, newThing, {
        body: ['to', 'subject', 'body', 'html'],
        result: false,
        errorTemplates: {
            general: 'Could not create new thing by user ${user}'
        }
    })
})

router.post('/email', (request, response) => {
    if (!isValid(request, response)) {
        return
    }

    EndpointUtil.handlePost(request, response, EmailService.sendEmail, {
        body: ['to', 'subject', 'body'],
        result: false,
        errorTemplates: {
            general: 'Could not send new email by user ${user}'
        }
    })
})

function isValid(request, response) {
    const {to, subject, body} = request.body

    if (!subject && !body) {
        response.status(400).send('body field is missing')
        return false
    }

    if (to && isString(to) && !validateEmailAddress(to)) {
        response.status(400).send('Invalid address')
        return false
    }

    return true
}

function validateEmailAddress(email) {
    const emailAddress = AddressParser.parseOneAddress(email)
    return !!emailAddress
}

function findDevice(deviceType) {
    return find(toArray(DeviceType), {expressDeviceType: deviceType})
}

export default router