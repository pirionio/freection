import SharedConstants from '../../../common/shared-constants'

const config = {
    BASE_URL: process.env.FREECTION_HOST || SharedConstants.DEFAULT_BASE_URL,
    LOG_LEVEL: process.env.LOG_LEVEL || SharedConstants.DEFAULT_LOG_LEVEL,
    COLLECT_LANGUAGE_INFO: process.env.COLLECT_LANGUAGE_INFO || SharedConstants.DEFAULT_COLLECT_LANGUAGE_INFO
}

export default config
