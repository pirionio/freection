const logger = require('../utils/logger')

function getIsDemo() {
    if (process.env.NODE_ENV !== 'production' || (process.env.NODE_ENV === 'production' && process.env.DEMO === '1')) {
        logger.info('Demo is ON')

        return true
    }

    return false
}

module.exports = {
    isDemo: getIsDemo()
}