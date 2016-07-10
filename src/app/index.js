const React = require ('react')
const ReactDOM  = require('react-dom')
const Root = require('./components/Root/Root')

require('./app.scss')

ReactDOM.render(
    // <Root store={store} history={history} />,
    <Root />,
    document.getElementById('app')
)

