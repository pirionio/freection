const React = require('react')
const {Component, PropTypes} = React
const {Router, Route, IndexRoute, IndexRedirect} = require('react-router')

const App = require('./components/App/App')
const MainApp = require('./components/MainApp/MainApp')
const WhatsNew = require('./components/WhatsNew/WhatsNew')
const UnreadNotifications = require('./components/WhatsNew/UnreadNotifications')
const UnreadEmails = require('./components/Emails/UnreadEmails')
const ToDo = require('./components/ToDo/ToDo')
const FollowUp = require('./components/FollowUp/FollowUp')
const Thing = require('./components/Thing/Thing')
const EmailThread = require('./components/Emails/EmailThread')
const Integrations = require('./components/Integrations/Integrations')
const Github = require('./components/Github/Github')

class AppRouter extends Component {
    render() {
        return (
            <Router history={this.props.history}>
                <Route path="/" component={App}>
                    <Route component={MainApp}>
                        <IndexRedirect to="/whatsnew" />
                        <Route path="/whatsnew" component={WhatsNew}>
                            <IndexRedirect to="/whatsnew/things" />
                            <Route path="/whatsnew/things" component={UnreadNotifications} />
                            <Route path="/whatsnew/emails" component={UnreadEmails} />
                        </Route>
                        <Route path="/todo" component={ToDo} />
                        <Route path="/followup" component={FollowUp} />
                        <Route path="/emails/:emailThreadId" component={EmailThread} />
                        <Route path="/things/:thingId" component={Thing} />
                        <Route path="/integrations">
                            <IndexRoute component={Integrations} />
                            <Route path="/integrations/github" component={Github} />
                        </Route>
                    </Route>
                </Route>
            </Router>
        )
    }
}
AppRouter.propTypes = {
    history: PropTypes.any.isRequired
}

module.exports = AppRouter