import path from 'path'
import fs from 'fs'
import process from 'process'

let config = {}

if (process.env.NODE_ENV === 'production') {
    const publicKey = fs.readFileSync(path.join(__dirname,'/compose-publickey.crt')).toString().trim()

    config = {
        servers: [{
            host: 'aws-us-east-1-portal.16.dblayer.com',
            port: 11239,
            ssl: {
                ca: publicKey
            }
        }],
        authKey: process.env.RDB_AUTH_KEY,
        db: process.env.RDB_DB_NAME,
        timeoutError: 3000,
        buffer: 10,
        max: 100}
}

export default config
