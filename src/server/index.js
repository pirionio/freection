const app = require('./shared')

require('./api')(app)
require('./static')(app)

app.start()