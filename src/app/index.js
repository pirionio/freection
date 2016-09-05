const React = require ('react')
const ReactDOM  = require('react-dom')
const { createStore, applyMiddleware } = require('redux')
const reducers = require('./reducers')
const {Provider} = require('react-redux')
const { browserHistory } = require('react-router')
const { syncHistoryWithStore, routerMiddleware } = require('react-router-redux')
const thunk = require('redux-thunk').default

const AppRouter = require('./routes')

const middleware = routerMiddleware(browserHistory)

let store = createStore(reducers,
    window.__STATE__, applyMiddleware(thunk, middleware))

// Create an enhanced history that syncs navigation events with the store
const history = syncHistoryWithStore(browserHistory, store)

ReactDOM.render(
    <Provider store={store}>
        <AppRouter history={history} />
    </Provider>,
    document.getElementById('app')
)

