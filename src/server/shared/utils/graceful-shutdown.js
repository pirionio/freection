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

function cleanUp() {
    const promises = cleanupCallbacks.map(callback => callback())

    Promise.all(promises)
        .then(() => {
            logger.info('shutting-down')

            process.exit()
        })
}

export function registerCleanupCallback(callback) {
    cleanupCallbacks.push(callback)
}




