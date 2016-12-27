import React, {Component, PropTypes} from 'react'
import {Router, Route, IndexRoute, IndexRedirect, Redirect} from 'react-router'

import App from './components/App/App'
import Login from './components/Login/Login'
import WelcomeWizard from './components/Welcome/WelcomeWizard'
import WelcomeIntro from './components/Welcome/Steps/WelcomeIntro'
import MainApp from './components/MainApp/MainApp'
import UnreadNotifications from './components/WhatsNew/UnreadNotifications'
import ToDo from './components/ToDo/ToDo'
import FollowUp from './components/FollowUp/FollowUp'
import AllThings from './components/All/Things/AllThings'
import Integrations from './components/Integrations/Integrations'
import Github from './components/Github/Github'
import Asana from './components/Asana/Asana'
import Trello from './components/Trello/Trello'
import Slack from './components/Slack/Slack'
import Gmail from './components/Gmail/Gmail'
import FullThing from './components/Thing/FullThing'

// import UnreadEmails from './components/Emails/UnreadEmails'
// import FullEmail from './components/Emails/FullEmail'

const routes = (
    <Route path="/" component={App}>
        <Route path="login" component={Login} />
        <Route path="welcome" component={WelcomeWizard}>
            <Route path="intro" component={WelcomeIntro} />
        </Route>
        <Route component={MainApp}>
            <IndexRedirect to="inbox" />
            <Route path="inbox" component={UnreadNotifications}>
                <Route path=":thingId" component={FullThing} />
            </Route>
            <Route path="todo" component={ToDo}>
                <Route path=":thingId" component={FullThing} />
            </Route>
            <Route path="followup" component={FollowUp}>
                <Route path=":thingId" component={FullThing} />
            </Route>
            <Route path="all/items" component={AllThings}>
                <Route path=":thingId" component={FullThing} />
            </Route>
            <Route path="integrations">
                <IndexRoute component={Integrations} />
                <Route path="github" component={Github} />
                <Route path="asana" component={Asana} />
                <Route path="trello" component={Trello} />
                <Route path="slack" component={Slack} />
                <Route path="gmail" component={Gmail} />
            </Route>
            <Redirect from="*" to="/inbox" />
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