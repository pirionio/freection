const React = require('react')
const {Component} = React
const {Router, Route, browserHistory, IndexRoute} = require('react-router')

const MainApp = require('../components/MainApp/MainApp')
const WhatsNew = require('../components/WhatsNew/WhatsNew')

class AppRouter extends Component {
    render() {
        return (
            <Router history={browserHistory}>
                <Route path="/" component={MainApp}>
                    <IndexRoute component={WhatsNew}/>
                    <Route path="/whatsnew" component={WhatsNew} />
                </Route>
            </Router>
        )
    }
}

module.exports = AppRouter