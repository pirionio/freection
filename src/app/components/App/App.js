const React = require('react')
const {Component} = React
const TopBar = require('./TopBar')
const AppHeader = require('./AppHeader')
const WhatsNew = require('../WhatsNew/WhatsNew')

class App extends Component {
    render () {
        return (
            <div className="app">
                <TopBar></TopBar>
                <AppHeader></AppHeader>
                <WhatsNew></WhatsNew>
            </div>
        )
    }
}

App.propTypes = {
}

module.exports = App