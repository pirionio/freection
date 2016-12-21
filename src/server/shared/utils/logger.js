import winston from 'winston'
import {Papertrail} from 'winston-papertrail'

import papertrailConfig from '../config/papertrail'
import GeneralConfig from '../config/general'

const transports = [
    new winston.transports.Console({
        timestamp: true,
        handleExceptions: true,
        humanReadableUnhandledException: true
    })]

if (papertrailConfig.enable) {
    transports.push(new Papertrail({
        host: papertrailConfig.host,
        port: papertrailConfig.port,
        hostname: papertrailConfig.source,
        program: 'freection',
        handleExceptions: true
    }))
}

export default new winston.Logger({
    level: GeneralConfig.LOG_LEVEL,
    transports
})