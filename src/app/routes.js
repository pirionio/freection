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
const Integrations = require('./components/Integrations/Integrations')
const Github = require('./components/Github/Github')
const FullThing = require('./components/Thing/FullThing')
const FullEmail = require('./components/Emails/FullEmail')

class AppRouter extends Component {
    render() {
        return (
            <Router history={this.props.history}>
                <Route path="/" component={App}>
                    <Route component={MainApp}>
                        <IndexRedirect to="whatsnew" />
                        <Route path="whatsnew" component={WhatsNew}>
                            <IndexRedirect to="things" />
                            <Route path="things" component={UnreadNotifications}>
                                <Route path=":thingId" component={FullThing} />
                            </Route>
                            <Route path="emails" component={UnreadEmails}>
                                <Route path=":emailThreadId" component={FullEmail} />
                            </Route>
                        </Route>
                        <Route path="todo" component={ToDo}>
                            <Route path=":thingId" component={FullThing} />
                        </Route>
                        <Route path="followup" component={FollowUp}>
                            <Route path=":thingId" component={FullThing} />
                        </Route>
                        <Route path="integrations">
                            <IndexRoute component={Integrations} />
                            <Route path="github" component={Github} />
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