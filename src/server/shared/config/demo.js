import logger from '../utils/logger'

export function getIsDemo() {
    if (process.env.NODE_ENV !== 'production' || (process.env.NODE_ENV === 'production' && process.env.DEMO === '1')) {
        logger.info('Demo is ON')

        return true
    }

    return false
}

export const isDemo = getIsDemo()
