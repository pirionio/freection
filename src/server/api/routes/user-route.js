import Router from 'express'

import * as UserService from '../../shared/application/users-service'
import logger from '../../shared/utils/logger'

const router = Router()

router.post('/todos', (request, response) => {
    const user = request.user
    const {todos} = request.body

    UserService.setTodos(user, todos)
        .then(result => response.json(result))
        .catch(error => {
            logger.error(`Could not set the things in todo for user ${user.email}`, error)
            response.status(500).send(`Could not set the things in todo for ${user.email}`)
        })
})

export default router