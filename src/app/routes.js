import React, {Component, PropTypes} from 'react'
import {Router, Route, IndexRoute, IndexRedirect, Redirect} from 'react-router'

import App from './components/App/App'
import MainApp from './components/MainApp/MainApp'
import UnreadNotifications from './components/WhatsNew/UnreadNotifications'
import ToDo from './components/ToDo/ToDo'
import FollowUp from './components/FollowUp/FollowUp'
import AllThings from './components/All/Things/AllThings'
import Integrations from './components/Integrations/Integrations'
import Github from './components/Github/Github'
import Slack from './components/Slack/Slack'
import Gmail from './components/Gmail/Gmail'
import FullThing from './components/Thing/FullThing'

// import UnreadEmails from './components/Emails/UnreadEmails'
// import FullEmail from './components/Emails/FullEmail'

const routes = (
    <Route path="/" component={App}>
        <Route component={MainApp}>
            <IndexRedirect to="notifications" />
            <Route path="notifications" component={UnreadNotifications}>
                <Route path=":thingId" component={FullThing} />
            </Route>
            <Route path="todo" component={ToDo}>
                <Route path=":thingId" component={FullThing} />
            </Route>
            <Route path="followup" component={FollowUp}>
                <Route path=":thingId" component={FullThing} />
            </Route>
            <Route path="all/things" component={AllThings}>
                <Route path=":thingId" component={FullThing} />
            </Route>
            <Route path="integrations">
                <IndexRoute component={Integrations} />
                <Route path="github" component={Github} />
                <Route path="slack" component={Slack} />
                <Route path="gmail" component={Gmail} />
            </Route>
            <Redirect from="*" to="/notifications" />
        </Route>
    </Route>
)

class AppRouter extends Component {
    render() {
        return (
            <Router history={this.props.history}>
                {routes}
            </Router>
        )
    }
}
AppRouter.propTypes = {
    history: PropTypes.any.isRequired
}

export default AppRouter