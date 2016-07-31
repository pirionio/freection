const React = require('react')
const {Component, PropTypes} = React
const {Router, Route, IndexRedirect} = require('react-router')

const App = require('../components/App/App')
const MainApp = require('../components/MainApp/MainApp')
const WhatsNew = require('../components/WhatsNew/WhatsNew')
const ToDo = require('../components/ToDo/ToDo')
const FollowUp = require('../components/FollowUp/FollowUp')
const Thing = require('../components/Thing/Thing')
const UnreadEmails = require('../components/Emails/UnreadEmails')

class AppRouter extends Component {
    render() {
        return (
            <Router history={this.props.history}>
                <Route path="/" component={App}>
                    <Route component={MainApp}>
                        <IndexRedirect to="/whatsnew" />
                        <Route path="/whatsnew" component={WhatsNew} />
                        <Route path="/todo" component={ToDo} />
                        <Route path="/followup" component={FollowUp} />
                        <Route path="/emails/unread" component={UnreadEmails} />
                        <Route path="/things/:thingId" component={Thing} />
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