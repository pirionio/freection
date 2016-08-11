const IMAP = {
    google: {
        MAIN_BOX: '[Gmail]',
        ALL_ATTRIBUTE: '\\All',
        THREAD_FIELD: 'X-GM-THRID',
        LABEL_FIELD: 'X-GM-LABELS',
        SEEN_FLAG: '\\Seen'
    },
    MAX_RETRIES: 2,
    CONNECTION_ALLOWED_IDLE_MILLIS: 1000 * 60 * 30
}

const SMTP = {
    MAX_RETRIES: 2,
    CONNECTION_ALLOWED_IDLE_MILLIS: 1000 * 60 * 30
}

module.exports = {IMAP, SMTP}