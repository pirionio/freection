const React = require('react')
const ReactDOM  = require('react-dom')
const { createStore, applyMiddleware } = require('redux')
const reducers = require('./reducers')
const {Provider} = require('react-redux')
const { browserHistory } = require('react-router')
const { syncHistoryWithStore, routerMiddleware } = require('react-router-redux')
const thunk = require('redux-thunk').default

const jss = require('jss').default
const jssExtend = require('jss-extend').default
const jssNested = require('jss-nested').default
const jssCamelCase = require('jss-camel-case').default
const jssDefaultUnit = require('jss-default-unit').default
const jssVendorPrefixer = require('jss-vendor-prefixer').default
const jssExpand = require('jss-expand').default

jss.use(
    jssExtend(),
    jssNested(),
    jssCamelCase(),
    jssDefaultUnit({
        'font-size': 'em'
    }),
    jssVendorPrefixer(),
    jssExpand()
)

const AppRouter = require('./routes')

const middleware = routerMiddleware(browserHistory)

const store = createStore(reducers,
    window.__STATE__, applyMiddleware(thunk, middleware))

// Create an enhanced history that syncs navigation events with the store
const history = syncHistoryWithStore(browserHistory, store)

ReactDOM.render(
    <Provider store={store}>
        <AppRouter history={history} />
    </Provider>,
    document.getElementById('app')
)

