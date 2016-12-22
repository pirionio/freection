import {Router} from 'express'

const router = Router()

router.post('/:userId', async function(request, response) {
    response.sendStatus(200)
})

export default router
