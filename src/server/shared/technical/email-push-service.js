import * as connectionCache from '../utils/imap/google-imap-connection-cache'
import {User, MailNotification} from '../models'
import logger from '../utils/logger'

function onMail(userId, email) {
    logger.info(`new emails for user ${email}`)

    MailNotification.save({
        id: userId,
        type: 'NEW',
        timestamp: new Date(),
    }, { conflict: 'replace' })
}

function onUpdate(userId, email, info) {
    // TODO: we handle this poorly be refreshing everything, we should only sent a notification
    // about specific issue
    // it is so poorly implemented that it will cause a refresh after every time we click discard
    // we might want to batch those calls for each user, to avoid to many refreshes

    logger.info(`email updated for user ${email}`)

    MailNotification.save({
        id: userId,
        type: 'UPDATE',
        timestamp: new Date(),
    }, { conflict: 'replace' })
}

export function hello(user) {
    const existConnection = connectionCache.getConnection(user)

    // If connection exist we just continue
    if (existConnection)
        return Promise.resolve()

    return User.get(user.id).run()
        .then(fullUser => connectionCache.createConnection(fullUser))
        .then(connection => {
            logger.info(`created push imap connection for ${user.email}`)

            connection.onMail(() => onMail(user.id, user.email))
            connection.onUpdate((seq, info) => onUpdate(user.id, user.email, info))

            MailNotification.save({
                id: user.id,
                type: 'HELLO',
                timestamp: new Date(),
            }, { conflict: 'replace' })
        })
}

export function keepAlive(user) {
    // If connection doesn't exist we throw an exception
    if (!connectionCache.resetTtl(user))
        throw 'NoConnection'
}