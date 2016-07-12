const React = require('react')
const {Component} = React

const AppRouter = require('../../routes')
const TopBar = require('../TopBar/TopBar')

class App extends Component {
    render () {
        return (
            <div className="app-root">
                <TopBar />
                <AppRouter />
            </div>
        )
    }
}

App.propTypes = {
}

module.exports = App