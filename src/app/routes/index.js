const React = require('react')
const {Component} = React
const {Router, Route, browserHistory, IndexRedirect} = require('react-router')

const App = require('../components/App/App')
const MainApp = require('../components/MainApp/MainApp')
const WhatsNew = require('../components/WhatsNew/WhatsNew')
const ToDo = require('../components/ToDo/ToDo')
const FollowUp = require('../components/FollowUp/FollowUp')
const Task = require('../components/Task/Task')

class AppRouter extends Component {
    render() {
        return (
            <Router history={browserHistory}>
                <Route path="/" component={App}>
                    <Route component={MainApp}>
                        <IndexRedirect to="/whatsnew" />
                        <Route path="/whatsnew" component={WhatsNew} />
                        <Route path="/todo" component={ToDo} />
                        <Route path="/followup" component={FollowUp} />
                        <Route path="/tasks/:taskId" component={Task} name="task" />
                    </Route>
                </Route>
            </Router>
        )
    }
}

module.exports = AppRouter