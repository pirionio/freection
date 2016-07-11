const React = require('react')
const {Component} = React

const TopBar = require('../TopBar/TopBar')
const MainApp = require('../MainApp/MainApp')

class App extends Component {
    render () {
        return (
            <div className="app-root">
                <TopBar />
                <MainApp />
            </div>
        )
    }
}

App.propTypes = {
}

module.exports = App