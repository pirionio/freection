const React = require('react')
const {Component} = React

const TopBar = require('../TopBar/TopBar')
const SideBar = require('../SideBar/SideBar')

class App extends Component {
    render () {
        return (
            <div className="app-root">
                <TopBar />
                <SideBar />
                {this.props.children}
            </div>
        )
    }
}

App.propTypes = {
}

module.exports = App