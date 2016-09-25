import logger from './logger'

const cleanupCallbacks = []

process.on('SIGTERM', () => {
    logger.info('application got SIGTERM')
    cleanUp()
})

process.on('SIGINT', () => {
    logger.info('application got SIGINT')
    cleanUp()
})

function cleanUp(code = 0) {
    const promises = cleanupCallbacks.map(callback => callback())

    Promise.all(promises)
        .then(() => {
            logger.info('shutting-down')

            process.exit(code)
        })
}

export function crash(reason = '') {
    logger.warn(`crashing process ${reason}`)
    cleanUp(1)
}

export function registerCleanupCallback(callback) {
    cleanupCallbacks.push(callback)
}




