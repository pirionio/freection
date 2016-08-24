const winston = require('winston')
const Papertrail = require('winston-papertrail').Papertrail
const papertrailConfig = require('../config/papertrail')

const transports = [
    new winston.transports.Console({
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

const logger = new winston.Logger({transports})

module.exports = logger