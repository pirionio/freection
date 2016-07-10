const React = require('react')
const {Component} = React
const TopBar = require('./TopBar')
const AppHeader = require('./AppHeader')
const WhatsNew = require('../WhatsNew/WhatsNew')

var things = [
    {
        id: 1,
        createAt: new Date(),
        creator: 'Daniel',
        assignee: 'Doron',
        subject: 'Fuck Off',
        body: 'This is the first thing we are going to do'
    },
    {
        id: 2,
        createAt: new Date(),
        creator: 'Doron',
        assignee: 'Daniel',
        subject: 'I change to yellow',
        body: 'Had enough with HaPoel'
    }
];

class App extends Component {
    render () {
        return (
            <div className="app">
                <TopBar></TopBar>
                <AppHeader></AppHeader>
                <WhatsNew things={things}></WhatsNew>
            </div>
        )
    }
}

App.propTypes = {
}

module.exports = App