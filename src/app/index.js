import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware, compose } from 'redux'
import {Provider} from 'react-redux'
import { browserHistory } from 'react-router'
import { syncHistoryWithStore, routerMiddleware } from 'react-router-redux'
import thunk from 'redux-thunk'
import jss from 'jss'
import jssExtend from 'jss-extend'
import jssNested from 'jss-nested'
import jssCamelCase from 'jss-camel-case'
import jssDefaultUnit from 'jss-default-unit'
import jssVendorPrefixer from 'jss-vendor-prefixer'
import jssExpand from 'jss-expand'

import reducers from './reducers'
import AppRouter from './routes'

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

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const middleware = routerMiddleware(browserHistory)

const store = createStore(reducers,
    window.__STATE__, composeEnhancers(applyMiddleware(thunk, middleware)))

// Create an enhanced history that syncs navigation events with the store
const history = syncHistoryWithStore(browserHistory, store)

ReactDOM.render(
    <Provider store={store}>
        <AppRouter history={history} />
    </Provider>,
    document.getElementById('app')
)

