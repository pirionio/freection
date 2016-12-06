import app from './shared'
import {isDemo} from './shared/config/demo'
import {configure as demo} from './demo'
import {configure as api} from './api'
import {configure as mailFetch} from './mail-fetch'
import {configure as push} from './push'
import {configure as webhook} from './webhook'
import {configure as configureStatic} from './static'
import {configure as bot} from './bot'

// import {configure as mailPush} from './mail-push'
// import {configure as mailSync} from './mail-sync'

if (isDemo)
    demo(app)

api(app)
mailFetch(app)
push(app)
webhook(app)
bot(app)
//mailPush(app)
//mailSync(app)
configureStatic(app)

app.start()