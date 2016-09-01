import app from './shared'
import {isDemo} from './shared/config/demo'

if (isDemo)
    require('./demo')(app)

require('./api')(app)
require('./mail-fetch')(app)
require('./push')(app)
require('./webhook')(app)
require('./mail-push')(app)
require('./mail-sync')(app)
require('./static')(app)

app.start()