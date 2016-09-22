import {Router} from 'express'
import pick from 'lodash/pick'

const router = Router()

router.get('/user', (request, response) => {
    response.json(pick(request.user, 'id', 'email', 'firstName', 'lastName', 'organization', 'username'))
})

export default router