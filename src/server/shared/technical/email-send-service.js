import * as GoogleSmtpConnectionPool from '../utils/smtp/google-smtp-connection-pool'

export async function sendMessage(user, message) {
    const connection = await GoogleSmtpConnectionPool.getConnection(user)
    try {
        await connection.sendMessage(message)
    } finally {
        GoogleSmtpConnectionPool.releaseConnection(user, connection)
    }
}