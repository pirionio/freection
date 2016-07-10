const React = require ('react')
const ReactDOM  = require('react-dom')
const { createStore } = require('redux')
const reducers = require('./reducers')
const {Provider} = require('react-redux')
const Root = require('./components/Root/Root')

require('./index.scss')

let store = createStore(reducers)

ReactDOM.render(
    <Provider store={store}>
        <Root />
    </Provider>,
    document.getElementById('app')
)

