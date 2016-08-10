const app = require('./shared')

require('./api')(app)
require('./mail-fetch')(app)
require('./static')(app)
require('./push')(app)
require('./webhook')(app)
require('./mail-push')(app)
require('./mail-sync')(app)

app.start()