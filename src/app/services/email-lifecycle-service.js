const EmailActions = require('../actions/email-actions')
const ResourceUtil = require('../util/resource-util')

class EmailLifecycleService {
    constructor() {
        this.doKeepAlive = this.doKeepAlive.bind(this)
    }

    initialize(dispatch) {
        this._dispatch = dispatch

        dispatch(EmailActions.hello())
        dispatch(EmailActions.fetchUnread())

        setInterval(this.doKeepAlive, 1000 * 60 * 1) // do keep alive every 1 minute
    }

    doKeepAlive() {
        ResourceUtil.post('/emails/push/keepalive', {})
            .catch(error => {
                if (error.response.status === 404) {
                    this._dispatch(EmailActions.hello())
                    this._dispatch(EmailActions.updateUnread())
                } else {

                    // the ping failed for some reason, let's invalidate the page
                    this._dispatch(EmailActions.invalidate())
                }
            })
    }

    updateUnread() {
        this._dispatch(EmailActions.updateUnread())
    }
}

module.exports = new EmailLifecycleService()
