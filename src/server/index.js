const app = require('./shared')

require('./api')(app)
require('./static')(app)
require('./push')(app)

app.start()