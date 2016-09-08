import * as EmailActions from '../actions/email-actions'
import * as ResourceUtil from '../util/resource-util'

class EmailLifecycleService {
    constructor() {
        this.doKeepAlive = this.doKeepAlive.bind(this)
    }

    initialize(dispatch) {
        this._dispatch = dispatch

        dispatch(EmailActions.hello()).then(() => {
            // Do keep alive every 1 minute, only once hello is successful.
            setInterval(this.doKeepAlive, 1000 * 60 * 1)
        })

        dispatch(EmailActions.fetchUnread())
    }

    reconnected() {
        this._dispatch(EmailActions.hello())
        this._dispatch(EmailActions.updateUnread())
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

export default new EmailLifecycleService()
