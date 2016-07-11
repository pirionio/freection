require('es6-promise').polyfill()
const React = require ('react')
const ReactDOM  = require('react-dom')
const { createStore, applyMiddleware } = require('redux')
const reducers = require('./reducers')
const {Provider} = require('react-redux')
const thunk = require('redux-thunk').default

const Root = require('./components/Root/Root')

require('./index.scss')

let store = createStore(reducers, window.__STATE__, applyMiddleware(
    thunk
))

ReactDOM.render(
    <Provider store={store}>
        <Root />
    </Provider>,
    document.getElementById('app')
)

