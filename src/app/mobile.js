import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import {createStore, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import jss from 'jss'
import jssExtend from 'jss-extend'
import jssNested from 'jss-nested'
import jssCamelCase from 'jss-camel-case'
import jssDefaultUnit from 'jss-default-unit'
import jssVendorPrefixer from 'jss-vendor-prefixer'
import jssExpand from 'jss-expand'
import 'onsenui/css/onsenui.css'
import 'onsenui/css/onsen-css-components.css'

import reducers from './reducers'
import MobileApp from './components/mobile/MobileApp'

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

const store = createStore(reducers, window.__STATE__, applyMiddleware(thunk))

const rootElement = document.getElementById('mobile-app')
ReactDOM.render(
    <Provider store={store}>
        <MobileApp />
    </Provider>,
    rootElement
)
