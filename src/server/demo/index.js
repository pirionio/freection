const initDemoDB = require('./init-demo-db')

module.exports = (app) => {
    app.get('/demo/init', function(request, response) {
        initDemoDB()
        response.send('OK - Init')
    })
}
