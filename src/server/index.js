const app = require('./shared')

require('./api')(app)
require('./demo')(app)
require('./mail-fetch')(app)
require('./push')(app)
require('./webhook')(app)
require('./mail-push')(app)
require('./mail-sync')(app)
require('./static')(app)

app.start()